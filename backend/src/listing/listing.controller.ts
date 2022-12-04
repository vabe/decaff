import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFile,
} from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import axios from "axios";
import { Protected } from "../auth/auth.decorator";
import { CommentService } from "../comment/comment.service";
import { CreateCommentDto } from "../comment/dto/createComment.dto";
import { CreateListingDto } from "./dto/createListing.dto";
import { UpdateListingDto } from "./dto/updateListing.dto";
import { ListingService } from "./listing.service";
import { join } from "path";
import { User } from "src/user/user.decorator";
import { User as UserType, UserRole } from "@prisma/client";
import { CaffInterceptor } from "src/interceptors/caff.interceptor";

@ApiTags("Listings")
@Controller("listings")
export class ListingController {
  constructor(
    private readonly commentService: CommentService,
    private readonly listingService: ListingService,
  ) {}

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
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        price: { type: "integer", minimum: 0 },
        userId: { type: "string" },
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @CaffInterceptor()
  async postListing(
    @User() user: UserType,
    @Body() body: CreateListingDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: +process.env.MAX_FILE_SIZE ?? 25000000,
        })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    Logger.log(`Post listing file: ${JSON.stringify(file)}`);
    if (body.price && body.price < 0) {
      throw new BadRequestException("Price must be greater or equal 0");
    }

    if (!file) {
      throw new BadRequestException("A file must be provided.");
    }

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
  putListing(
    @Param("listingId") listingId: string,
    @User() user: UserType,
    @Body() body: UpdateListingDto,
  ) {
    Logger.log(`Put listing listingId: ${listingId}`);
    return this.listingService.updateListing(listingId, { ...body, userId: user.id });
  }

  @Protected([UserRole.ADMIN])
  @Delete(":listingId")
  deleteListing(@Param("listingId") listingId: string) {
    Logger.log(`Delete listing listingId: ${listingId}`);
    return this.listingService.deleteListing(listingId);
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
