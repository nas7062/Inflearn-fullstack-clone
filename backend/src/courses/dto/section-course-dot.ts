import { ApiProperty } from '@nestjs/swagger';

export class SectionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  order: number;
}
