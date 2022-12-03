import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { isUndefined } from "lodash";
import { PrismaService } from "../../prisma/prisma.service";
import { hashValue } from "../utils/hashHelper";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  findUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    if (!isUndefined(data.password)) {
      data.password = await hashValue(data.password);
    }
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }

  deleteUser(userId: string) {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
