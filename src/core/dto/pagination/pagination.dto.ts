import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto<T> {
  @ApiProperty({
    description: 'The page number',
    example: 1,
  })
  page: number = 1;

  @ApiProperty({
    description: 'The number of items per page',
    example: 10,
  })
  limit: number = 10;

  items: T[];
}
