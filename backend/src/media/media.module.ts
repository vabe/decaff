import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { MediaService } from './media.service';

@Module({ providers: [PrismaService, MediaService] })
export class MediaModule {}
