import { ApiProperty } from '@nestjs/swagger';
import { LectureDto } from 'src/lectures/dto/lecture-dto';

export class SectionDto {
  @ApiProperty()
  
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  order: number;

  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ type: [LectureDto] })
  lectures: Array<LectureDto>;
}
