import { ApiProperty } from "@nestjs/swagger";

export class UpdateListingDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  price?: number;

  @ApiProperty()
  userId?: string;
}
