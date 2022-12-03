import {ApiProperty} from '@nestjs/swagger'

export class CreateHistoryDto {
    @ApiProperty()
    listingId: string;
}