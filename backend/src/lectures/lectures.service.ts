import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createLectureDto } from './dto/create-lecture-dto';
import { Lecture } from '@prisma/client';
import { updateLectureDto } from './dto/update-lecture-dto';

@Injectable()
export class LecturesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(sectionId: string, createLectureDto: createLectureDto, userId: string): Promise<Lecture> {
    const section = await this.prisma.section.findUnique({
      where: {
        id: sectionId,
      },
      include: {
        course: true,
      },
    });
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    if (section.course.instructorId !== userId) {
      throw new ForbiddenException('You are not the instructor of this section');
    }
    const lastLecture = await this.prisma.lecture.findFirst({
      where: {
        sectionId: sectionId,
      },
      orderBy: {
        order: 'desc',
      },
    });
    const order = lastLecture ? lastLecture.order + 1 : 0;
    return this.prisma.lecture.create({
      data: {
        ...createLectureDto,
        order,
        section: {
          connect: {
            id: sectionId,
          },
        },
        course: {
          connect: {
            id: section.courseId,
          },
        },
      },
    });
  }

  async update(lectureId: string, userId: string, updateLectureDto: updateLectureDto): Promise<Lecture> {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        course: {
          select: {
            instructorId: true,
          },
        },
      },
    });
    if (!lecture) {
      throw new NotFoundException('Section not found');
    }
    if (lecture.course.instructorId !== userId) {
      throw new ForbiddenException('You are not the instructor of this section');
    }
    return this.prisma.lecture.update({
      where: { id: lectureId },
      data: {
        ...updateLectureDto,
      },
    });
  }

  async findOne(lectureId: string, userId: string): Promise<Lecture> {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        course: {
          select: {
            instructorId: true,
          },
        },
      },
    });
    if (!lecture) {
      throw new NotFoundException('Section not found');
    }
    if (lecture.course.instructorId !== userId) {
      throw new ForbiddenException('You are not the instructor of this section');
    }
    return lecture;
  }

  async delete(lectureId: string, userId: string): Promise<Lecture> {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        course: {
          select: {
            instructorId: true,
          },
        },
      },
    });
    if (!lecture) {
      throw new NotFoundException('Section not found');
    }
    if (lecture.course.instructorId !== userId) {
      throw new ForbiddenException('You are not the instructor of this section');
    }
    return this.prisma.lecture.delete({
      where: { id: lectureId },
    });
  }
}
