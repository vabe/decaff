import { ApiProperty } from "@nestjs/swagger";
import { MediaType } from "@prisma/client";

export class CreateMediaDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  preview: number[];

  @ApiProperty()
  imageUri: string;

  @ApiProperty({
    type: MediaType
  })
  type: MediaType;

  @ApiProperty()
  sourceCreatedAt: Date;
}
