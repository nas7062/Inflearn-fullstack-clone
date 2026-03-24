import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, isNotEmpty, IsString } from 'class-validator';

export class createLectureDto {
  @ApiProperty({ description: '강의 제목' })
  @IsNotEmpty()
  @IsString()
  title: string;
}
