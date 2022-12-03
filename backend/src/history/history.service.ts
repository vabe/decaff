import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  getHistory(userId: string) {
    return this.prisma.history.findMany({
      where: {
        userId,
      },
      include: {
        listing: {
          include: {
            media: true,
          },
        },
      },
    });
  }

  getHistoryById(userId: string, listingId: string) {
    return this.prisma.history.findUnique({
      where: {
        History_key: { userId, listingId },
      },
      include: {
        listing: {
          include: {
            media: true,
          },
        },
      },
    });
  }

  async createHistory(listingId: string, userId: string) {
    const historyItems = await this.prisma.history.findMany({
      where: {
        userId,
        listingId,
      },
    });

    if (historyItems.length > 0) {
      throw new BadRequestException("You can only buy the listing once.");
    }

    return this.prisma.history.create({
      data: {
        userId,
        listingId,
      },
    });
  }
}
