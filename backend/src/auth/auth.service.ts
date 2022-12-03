import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { Auth } from "./auth.entity";
import { CreateUserDto } from "../user/dto/createUser.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { hashValue } from "../utils/hashHelper";
import { MailService } from "src/mail/mail.service";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(email: string, password: string): Promise<Auth> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordCorrent = await compare(password, user.password);

    if (!isPasswordCorrent) {
      throw new UnauthorizedException("Invalid password");
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async register(newUser: CreateUserDto): Promise<any> {
    const { password, ...user } = newUser;

    const hashedPassword = await hashValue(password);
    const createdUser = await this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });

    const accessToken = this.jwtService.sign({ userId: createdUser.id });

    this.mailService.sendVerificationEmail(createdUser, accessToken);
  }

  verifyEmail(user: User) {
    Logger.log(user)
    if (user.isVerified) {
      throw new BadRequestException("User already verified");
    }

    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
      },
    });
  }

  validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
