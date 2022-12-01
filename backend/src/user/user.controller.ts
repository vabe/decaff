import { Body, Controller, Get, Logger, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UserController {
  @Get()
  getUsers() {
    return "getUsers";
  }

  @Get(":id")
  getUser(@Param("id") id: string) {
    Logger.log(`Get user by id: ${id}`);
    return;
  }

  @Post()
  createUser(@Body() body: { name: string; email: string; password: string }) {
    Logger.log(body);
    return "createUser";
  }

  @Put(":id")
  updateUser(@Param("id") id: string, @Body() body: any) {
    Logger.log(`Put user id: ${id}`);
    return "updateUser";
  }
}
