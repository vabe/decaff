import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { Auth } from "./auth.entity";
import { CreateUserDto } from "../user/dto/createUser.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { hashValue } from "../utils/hashHelper";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

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

    return {
      accessToken: this.jwtService.sign({ userId: createdUser.id }),
    };
  }

  validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
