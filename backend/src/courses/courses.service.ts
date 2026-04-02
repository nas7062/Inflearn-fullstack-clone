import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course-dto';
import { Course, Prisma } from '@prisma/client';
import { UpdateCourseDto } from './dto/update-course-dto';
import slugify from '../../lib/slugify';
@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createCourseDto: CreateCourseDto): Promise<Course> {
    return this.prisma.course.create({
      data: {
        title: createCourseDto.title,
        slug: slugify(createCourseDto.title),
        instructorId: userId,
        status: 'DRAFT',
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CourseWhereUniqueInput;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }): Promise<Course[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.course.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
  async findOne(id: string, include?: Prisma.CourseInclude): Promise<Course | null> {
    const includeObject = {};

    const course = await this.prisma.course.findUnique({
      where: { id },
      include,
    });

    if (!course) {
      throw new NotFoundException('course를 찾을 수 없습니다.');
    }
    return course;
  }
  async update(id: string, userId: string, updateCourseDto: UpdateCourseDto): Promise<Course | null> {
    const course = await this.findOne(id);
    if (!course) {
      throw new NotFoundException('course를 찾을 수 없습니다.');
    }
    const { categoryIds, ...rest } = updateCourseDto;
    let data: Prisma.CourseUpdateInput = {
      ...rest,
    };
    if (categoryIds && categoryIds.length > 0) {
      data.categories = {
        connect: categoryIds.map((id) => ({ id })),
      };
    }
    if (course.instructorId !== userId) {
      throw new ForbiddenException('소유자만 수정이 가능합니다.');
    }
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }
  async remove(id: string, userId: string) {
    const course = await this.findOne(id);
    if (!course) {
      throw new NotFoundException('course를 찾을 수 없습니다.');
    }
    if (course.instructorId !== userId) {
      throw new ForbiddenException('소유자만 삭제가 가능합니다.');
    }
    await this.prisma.course.delete({
      where: { id },
    });
    return course;
  }
}
