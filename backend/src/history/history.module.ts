import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { HistoryController } from "./history.controller";
import { HistoryService } from "./history.service";

@Module({
  controllers: [HistoryController],
  providers: [HistoryService, PrismaService],
})
export class HistoryModule {}
