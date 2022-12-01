import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCommentDto } from "./dto/createComment.dto";

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  createComment(data: CreateCommentDto) {
    return this.prisma.comment.create({
      data,
    });
  }

  getCommentsByListingId(listingId: string) {
    return this.prisma.comment.findMany({
      where: {
        listingId,
      },
    });
  }

  getCommentById(commentId: string) {
    return this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
  }

  deleteComment(commentId: string) {
    return this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
