import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import axios from "axios";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { Protected } from "../auth/auth.decorator";
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";
import { CommentService } from "../comment/comment.service";
import { CreateCommentDto } from "../comment/dto/createComment.dto";
import { CreateListingDto } from "./dto/createListing.dto";
import { UpdateListingDto } from "./dto/updateListing.dto";
import { ListingService } from "./listing.service";
import { replace } from "lodash";
import { join } from "path";

@ApiTags("Listings")
@Controller("listings")
export class ListingController {
  constructor(
    private readonly listingService: ListingService,
    private readonly commentService: CommentService,
  ) {}

  @Protected()
  @Get()
  getListings() {
    return this.listingService.getAllListings();
  }

  @Get(":listingId")
  getListing(@Param("listingId") listingId: string) {
    Logger.log(`Get listing by listingId: ${listingId}`);
    return this.listingService.getListingById(listingId);
  }

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
          const pathName = `./uploads/${req.body.userId}`;

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
    @Body() body: CreateListingDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    Logger.log(`Post listing file: ${JSON.stringify(file)}`);

    // const escapedPath = `${__dirname.replace(/\\/g, "/")}${file.destination.slice(1)}`;
    const uploadsDirectory = join(__dirname, "..", "..", "..");
    const escapedPath = uploadsDirectory.replace(/\/\\/g, "/");
    const finalPath = join(escapedPath, file.destination.slice(1));

    Logger.log(finalPath);
    Logger.log(file.filename);

    const metadataResponse = await axios.post("http://localhost:5000/uploader", {
      upload_path: finalPath,
      json_name: file.filename,
    });

    const metadata = metadataResponse.data;

    Logger.log(metadata);

    return this.listingService.createListing(body);
  }

  @Put(":listingId")
  putListing(@Param("listingId") listingId: string, @Body() body: UpdateListingDto) {
    Logger.log(`Put listing listingId: ${listingId}`);
    return this.listingService.updateListing(listingId, body);
  }

  @Post(":listingId/comments")
  postComment(@Param("listingId") listingId: string, @Body() body: CreateCommentDto) {
    if (listingId !== body.listingId) {
      throw new BadRequestException("ListingId in body must match listingId in path");
    }

    return this.commentService.createComment(body);
  }

  @Post(":listingId/comments/:commentId")
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
