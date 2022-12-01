import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CommentService } from "./comment.service";

@Module({
  providers: [CommentService],
  imports: [PrismaService],
})
export class CommentModule {}
