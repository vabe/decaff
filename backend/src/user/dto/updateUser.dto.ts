import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsString } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  email?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  password?: string;

  @ApiProperty({
    required: false,
  })
  role?: UserRole;
}
