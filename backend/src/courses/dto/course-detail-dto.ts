import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from './response-course-dto';

export class CourseDetailDto extends CourseResponseDto {
  @ApiProperty({ description: '총 수강생 수', type: Number })
  totalEnrollmentCount: number;
  @ApiProperty({ description: '평균 평점', type: Number })
  averageRating: number;
  @ApiProperty({ description: '총 리뷰 수', type: Number })
  totalReviewCount: number;
  @ApiProperty({ description: '총 강의 수', type: Number })
  totalLectureCount: number;
  @ApiProperty({ description: '총 강의 시간(초)', type: Number })
  totalDuration: number;
}
