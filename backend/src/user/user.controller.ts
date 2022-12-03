import { BadRequestException, Body, Controller, Delete, Get, Param, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User as UserType, UserRole } from "@prisma/client";
import { Protected } from "../auth/auth.decorator";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { User } from "./user.decorator";
import { isEmpty } from "lodash";
import { UserService } from "./user.service";

@ApiTags("Users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  @Protected()
  getMe(@User() currentUser: UserType) {
    return this.userService.getUserById(currentUser.id);
  }

  @Put("me")
  @Protected()
  updateMe(@User() currentUser: UserType, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(currentUser.id, body);
  }

  @Protected([UserRole.ADMIN])
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Protected([UserRole.ADMIN])
  @Get(":id")
  getUser(@Param("id") id: string) {
    return this.userService.getUserById(id);
  }

  @Protected([UserRole.ADMIN])
  @Put(":id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
    if (isEmpty(body)) {
      throw new BadRequestException("No data provided");
    }
    return this.userService.updateUser(id, body);
  }

  @Protected([UserRole.ADMIN])
  @Delete(":id")
  deleteUser(@Param("id") id: string) {
    return this.userService.deleteUser(id);
  }
}
