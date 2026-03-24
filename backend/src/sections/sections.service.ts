import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Section } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section-dto copy';
import { UpdateSectionDto } from './dto/update-section-dto';

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, courseId: string, createSectionDto: CreateSectionDto): Promise<Section> {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (course.instructorId !== userId) {
      throw new ForbiddenException('You are not the instructor of this course');
    }
    const lastSection = await this.prisma.section.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        order: 'desc',
      },
    });
    const order = lastSection ? lastSection.order + 1 : 0;
    return this.prisma.section.create({
      data: {
        ...createSectionDto,
        order,
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string): Promise<Section> {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            instructorId: true,
          },
        },
        lectures: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    if (section.course.instructorId !== userId) {
      throw new ForbiddenException('You are not the instructor of this section');
    }
    return section;
  }

  async update(id: string, userId: string, updateSectionDto: UpdateSectionDto): Promise<Section> {
    const section = await this.prisma.section.findUnique({
      where: { id },
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
    return this.prisma.section.update({
      where: { id },
      data: {
        ...updateSectionDto,
      },
    });
  }

  async delete(id: string, userId: string): Promise<Section> {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            instructorId: true,
          },
        },
      },
    });
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    if (section.course.instructorId !== userId) {
      throw new ForbiddenException('You are not the instructor of this section');
    }
    await this.prisma.section.delete({
      where: { id },
    });
    return section;
  }
}
