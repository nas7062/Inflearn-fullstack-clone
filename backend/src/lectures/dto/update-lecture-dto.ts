import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { CreateLectureDto } from './create-lecture-dto';

export class updateLectureDto extends PartialType(CreateLectureDto) {
  @ApiProperty({ description: '강의 설명', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '강의 순서', required: false })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({ description: '강의 재생시간', required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ description: '강의 미리보기 여부', required: false })
  @IsOptional()
  @IsBoolean()
  isPreview?: boolean;

  @ApiProperty({ description: '강의 비디오 업로드 정보', required: false })
  @IsOptional()
  @IsObject()
  videoStorageInfo?: Record<string, any>;
}
