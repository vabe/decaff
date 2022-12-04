import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateListingDto } from "./dto/updateListing.dto";

@Injectable()
export class ListingService {
  constructor(private readonly prisma: PrismaService) {}

  getAllListings() {
    return this.prisma.listing.findMany({
      include: {
        media: true,
      },
    });
  }

  getListingById(listingId: string) {
    return this.prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        media: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  createListing(listingData: any, mediaData: any, userId: string) {
    return this.prisma.listing.create({
      data: {
        ...listingData,
        price: +listingData.price,
        owner: {
          connect: {
            id: userId,
          },
        },
        media: {
          create: mediaData,
        },
      },
    });
  }

  updateListing(listingId: string, data: UpdateListingDto) {
    return this.prisma.listing.update({
      where: {
        id: listingId,
      },
      data,
    });
  }

  deleteListing(listingId: string) {
    return this.prisma.listing.delete({
      where: {
        id: listingId,
      },
    });
  }
}
