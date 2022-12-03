import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import axios from "axios";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { Protected } from "../auth/auth.decorator";
import { CommentService } from "../comment/comment.service";
import { CreateCommentDto } from "../comment/dto/createComment.dto";
import { CreateListingDto } from "./dto/createListing.dto";
import { UpdateListingDto } from "./dto/updateListing.dto";
import { ListingService } from "./listing.service";
import { join } from "path";
import { User } from "src/user/user.decorator";
import { User as UserType, UserRole } from "@prisma/client";

@ApiTags("Listings")
@Controller("listings")
export class ListingController {
  constructor(
    private readonly commentService: CommentService,
    private readonly listingService: ListingService,
  ) {}

  @Protected()
  @Get()
  getListings() {
    return this.listingService.getAllListings();
  }

  @Get(":listingId")
  getListing(@Param("listingId") listingId: string) {
    return this.listingService.getListingById(listingId);
  }

  @Protected()
  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      dest: "./uploads",
      fileFilter: (_, file, cb) => {
        const fileType = file.originalname.slice(-5);
        const allowedFileTypes = [".ciff", ".caff"];

        if (allowedFileTypes.includes(fileType)) {
          return cb(null, true);
        }

        cb(new BadRequestException("File must be a ciff or caff file"), false);
      },
      storage: diskStorage({
        destination: (req, file, cb) => {
          const pathName = `./uploads/${(req.user as UserType).id}`;

          if (!existsSync(pathName)) {
            mkdirSync(pathName);
          }

          cb(null, pathName);
        },
        filename: (_, file, cb) => {
          const fileType = file.originalname.slice(-5);
          const fileName = file.originalname.slice(0, -5);
          const savedFileName = `${Date.now()}_${fileName}${fileType}`;
          cb(null, savedFileName);
        },
      }),
    }),
  )
  async postListing(
    @User() user: UserType,
    @Body() body: CreateListingDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    Logger.log(`Post listing file: ${JSON.stringify(file)}`);

    const uploadsDirectory = join(__dirname, "..", "..", "..");
    const escapedPath = uploadsDirectory.replace(/\/\\/g, "/");
    const finalPath = join(escapedPath, file.destination.slice(1));

    Logger.log(finalPath);
    Logger.log(file.filename);

    try {
      const { data } = await axios.post("http://localhost:5000/uploader", {
        upload_path: finalPath,
        json_name: file.filename,
      });

      const { year, month, day, hour, minute } = data.created;

      return this.listingService.createListing(
        {
          name: body.name,
          caption: data.caption,
          tags: data.tags,
          price: body.price,
        },
        {
          name: file.filename,
          preview: data.preview,
          imageUri: join(finalPath, file.filename),
          type: data.type.toUpperCase(),
          sourceCreatedAt: new Date(year, month, day, hour, minute),
        },
        user.id,
      );
    } catch (error) {
      throw new BadRequestException("Parsing error: please provide a valid CIFF or CAFF file.");
    }
  }

  @Protected([UserRole.ADMIN])
  @Put(":listingId")
  putListing(@Param("listingId") listingId: string, @Body() body: UpdateListingDto) {
    Logger.log(`Put listing listingId: ${listingId}`);
    return this.listingService.updateListing(listingId, body);
  }

  @Protected()
  @Post(":listingId/comments")
  postComment(
    @Param("listingId") listingId: string,
    @Body() body: CreateCommentDto,
    @User() user: UserType,
  ) {
    Logger.log(listingId);

    return this.commentService.createComment({ content: body.content, userId: user.id, listingId });
  }

  @Protected([UserRole.ADMIN])
  @Delete(":listingId/comments/:commentId")
  async deleteComment(
    @Param("listingId") listingId: string,
    @Param("commentId") commentId: string,
  ) {
    const comment = await this.commentService.getCommentById(commentId);

    if (comment.listingId !== listingId) {
      throw new BadRequestException("Comment does not belong to listing");
    }

    return this.commentService.deleteComment(commentId);
  }
}
