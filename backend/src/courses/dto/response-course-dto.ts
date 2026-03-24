import { ApiProperty } from '@nestjs/swagger';
import { InstructorDto } from './instructor-course-dot';
import { CategoryDto } from './category-course-dto';
import { SectionDto } from './section-course-dot';

export class CourseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  shortDescription?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  thumbnailUrl?: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false })
  discountPrice?: number;

  @ApiProperty()
  level: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  instructorId: string;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: InstructorDto })
  instructor: InstructorDto;

  @ApiProperty({ type: [CategoryDto] })
  categories: CategoryDto[];

  @ApiProperty({ type: [SectionDto] })
  sections: SectionDto[];

  @ApiProperty()
  reviewCount: number;

  @ApiProperty()
  enrollmentCount: number;
}
