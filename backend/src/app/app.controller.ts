import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Common")
@Controller()
export class AppController {
  constructor() {}

  @Get("ping")
  getHello(): string {
    return "pong";
  }
}
