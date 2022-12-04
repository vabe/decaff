import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  getMediaById(mediaId: string) {
    return this.prisma.media.findUnique({
      where: {
        id: mediaId,
      },
    });
  }

  deleteMedia(mediaId: string) {
    return this.prisma.media.delete({
      where: { id: mediaId },
    });
  }
}
