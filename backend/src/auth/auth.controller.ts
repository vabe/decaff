import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../user/dto/createUser.dto";
import { Protected } from "./auth.decorator";
import { Auth } from "./auth.entity";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { User } from "src/user/user.decorator";
import { User as UserType } from "@prisma/client";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOkResponse({ type: Auth })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post("register")
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Protected()
  @Post("email-verification")
  verifyEmail(@User() user: UserType) {
    return this.authService.verifyEmail(user);
  }
}
