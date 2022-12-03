import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty,IsOptional } from "class-validator";

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
