import { Body, Controller, Get, Logger, Param, Post, Put } from "@nestjs/common";

@Controller("listings")
export class ListingController {
  @Get()
  getListings() {
    return "getListings";
  }

  @Get(":id")
  getListing(@Param("id") id: string) {
    Logger.log(`Get listing by id: ${id}`);
    return "getListings";
  }

  @Post()
  postListing(@Body() body: any) {
    return "createListing";
  }

  @Put(":id")
  putListing(@Param("id") id: string, @Body() body: any) {
    Logger.log(`Put listing id: ${id}`);
    return "createListing";
  }
}
