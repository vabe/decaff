import { Controller, Get, Body, Post, Res, StreamableFile, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Protected } from "src/auth/auth.decorator";
import { User } from "src/user/user.decorator";
import { HistoryService } from "./history.service";
import { User as UserType } from "@prisma/client";
import { CreateHistoryDto } from "./dto/createHistory.dto";
import { createReadStream } from "fs";
import type { Response } from "express";

@ApiTags("History")
@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Protected()
  @Get()
  getHistory(@User() user: UserType) {
    return this.historyService.getHistory(user.id);
  }

  @Protected()
  @Get(":listingId")
  async getHistoryFile(
    @Param("listingId") listingId: string,
    @Res({ passthrough: true }) res: Response,
    @User() user: UserType,
  ): Promise<StreamableFile> {
    const history = await this.historyService.getHistoryById(user.id, listingId);
    console.log(history);
    const file = createReadStream(history.listing.media.imageUri);
    res.set({
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${history.listing.name}"`,
    });
    return new StreamableFile(file);
  }

  @Protected()
  @Post()
  postHistory(@User() user: UserType, @Body() body: CreateHistoryDto) {
    return this.historyService.createHistory(body.listingId, user.id);
  }
}
