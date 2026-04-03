import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course-dto';
import { Course, Prisma } from '@prisma/client';
import { UpdateCourseDto } from './dto/update-course-dto';
import slugify from '../../lib/slugify';
import { SearchCourseResponseDto } from './dto/search-response-dto';
import { SearchCourseDto } from './dto/search-coures-dto';
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

  async searchCourses(searchCourseDto: SearchCourseDto): Promise<SearchCourseResponseDto> {
    const { q, category, charge, sortBy, order, page = 1, pageSize = 20 } = searchCourseDto;

    const where: Prisma.CourseWhereInput = {};

    // 키워드 검색 (강의명, 강사명에서 부분 일치)
    if (q) {
      where.OR = [
        {
          title: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          instructor: {
            name: {
              contains: q,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // 카테고리 필터
    if (category) {
      where.categories = {
        some: {
          id: category,
        },
      };
    }

    // charge가 free 면
    if (charge === 'free') {
      where.price = 0; //  price = 0 이 무료
    } else if (charge === 'all') {
      where.price = { gt: 0 }; //  price > 0 이 유료
    }

    // 정렬 조건
    const orderBy: Prisma.CourseOrderByWithRelationInput = {};
    if (sortBy === 'price') {
      orderBy.price = order as 'asc' | 'desc';
    }

    // 페이지네이션 계산

    const skip = (page - 1) * pageSize;
    const totalItems = await this.prisma.course.count({ where });

    // 강의 목록 조회
    const courses = await this.prisma.course.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: true,
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      success: true,
      data: {
        courses: courses as any[],
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          hasNext,
          hasPrev,
        },
      },
    };
  }
}
