import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CommentService } from "../comment/comment.service";
import { ListingController } from "./listing.controller";
import { ListingService } from "./listing.service";

@Module({
  controllers: [ListingController],
  providers: [CommentService, ListingService, PrismaService],
})
export class ListingModule {}
