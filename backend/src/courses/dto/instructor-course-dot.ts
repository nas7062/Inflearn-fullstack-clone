import { ApiProperty } from '@nestjs/swagger';

export class InstructorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;
}
