import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateListingDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsOptional()
  userId?: string;
}
