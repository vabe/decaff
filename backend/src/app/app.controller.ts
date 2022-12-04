import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Common")
@Controller()
export class AppController {
  @Get("ping")
  getHello(): string {
    return "pong";
  }
}
