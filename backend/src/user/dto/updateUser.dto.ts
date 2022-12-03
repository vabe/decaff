import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  role?: UserRole;
}
