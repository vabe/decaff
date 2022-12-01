import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateListingDto } from "./dto/createListing.dto";
import { UpdateListingDto } from "./dto/updateListing.dto";

@Injectable()
export class ListingService {
  constructor(private readonly prisma: PrismaService) {}

  getAllListings() {
    return this.prisma.listing.findMany();
  }

  getListingById(listingId: string) {
    return this.prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
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

  createListing(data: CreateListingDto) {
    return this.prisma.listing.create({ data: { ...data, price: +data.price } });
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
