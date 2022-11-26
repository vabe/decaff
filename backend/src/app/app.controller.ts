import { Controller, Get, Req } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/hi")
  getHi(@Req() request: any): string {
    return `Hi ${request["user"]?.email}`;
  }
}
