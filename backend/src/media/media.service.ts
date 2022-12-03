import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateMediaDto } from "./dto/createMedia.dto";

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

  // TODO: kell?
  // getMediaByListingId

  // createMedia(data: CreateMediaDto) {
  //   return this.prisma.media.create({
  //     data: {
  //       ...data,
  //       listing: {
  //         create: {
  //           name: "",
  //           price: 2,
  //           userId: "",
  //           owner: {
  //             connect: {
  //               id:
  //             }
  //           }
  //         },
  //       },
  //     },
  //   });
  // }

  deleteMedia(mediaId: string) {
    return this.prisma.media.delete({
      where: { id: mediaId },
    });
  }
}
