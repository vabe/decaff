import { ApiProperty } from "@nestjs/swagger";

export class CreateListingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  userId: string;
}
