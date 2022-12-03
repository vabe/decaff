import { Module } from "@nestjs/common";
import { MediaService } from "src/media/media.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CommentService } from "../comment/comment.service";
import { ListingController } from "./listing.controller";
import { ListingService } from "./listing.service";

@Module({
  controllers: [ListingController],
  providers: [CommentService, ListingService, PrismaService, MediaService],
})
export class ListingModule {}
