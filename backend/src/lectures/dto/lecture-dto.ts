import { ApiProperty } from '@nestjs/swagger';

export class LectureDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  order: number;

  @ApiProperty({ required: false, nullable: true })
  duration: number | null;

  @ApiProperty()
  isPreview: boolean;

  @ApiProperty()
  sectionId: string;

  @ApiProperty()
  courseId: string;

  @ApiProperty({ required: false, nullable: true })
  videoStorageInfo: Record<string, unknown> | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
