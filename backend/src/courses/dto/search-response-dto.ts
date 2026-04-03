import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from './response-course-dto';
import { IsArray } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: '현재 페이지' })
  currentPage: number;

  @ApiProperty({ description: '전체 페이지 수' })
  totalPages: number;

  @ApiProperty({ description: '전체 아이템 수' })
  totalItems: number;

  @ApiProperty({ description: '다음 페이지 존재 여부' })
  hasNext: boolean;

  @ApiProperty({ description: '이전 페이지 존재 여부' })
  hasPrev: boolean;
}

export class SearchCourseResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '강의 목록', isArray: true, type: CourseResponseDto })
  @IsArray()
  courses: CourseResponseDto[];
  @ApiProperty({ description: '페이지네이션 정보', type: PaginationDto })
  pagination: PaginationDto;
}
