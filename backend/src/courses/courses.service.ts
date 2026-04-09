import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course-dto';
import { Course, Prisma } from '@prisma/client';
import { UpdateCourseDto } from './dto/update-course-dto';
import slugify from '../../lib/slugify';
import { SearchCourseResponseDto } from './dto/search-response-dto';
import { SearchCourseDto } from './dto/search-coures-dto';
import { CourseDetailDto } from './dto/course-detail-dto';
import { FavoriteResponseDto } from './dto/favorite-dto';
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
  async findOne(id: string): Promise<CourseDetailDto | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        categories: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        enrollments: true,
        sections: {
          include: {
            lectures: {
              select: {
                id: true,
                title: true,
                duration: true,
                order: true,
                isPreview: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            lectures: true,
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('course를 찾을 수 없습니다.');
    }
    const averageRating =
      course.reviews.length > 0
        ? course.reviews.reduce((acc, review) => acc + review.rating, 0) / course.reviews.length
        : 0;

    const totalDuration = course.sections.reduce(
      (acc, section) => acc + section.lectures.reduce((acc, lecture) => acc + (lecture.duration ?? 0), 0),
      0,
    );
    const result = {
      ...course,
      totalEnrollmentCount: course._count.enrollments,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviewCount: course._count.reviews,
      totalLectureCount: course._count.lectures,
      totalDuration,
    };
    return result as unknown as CourseDetailDto;
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
          slug: category,
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
      skip: Number(skip),
      take: Number(pageSize),
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
      courses: courses as any[],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNext,
        hasPrev,
      },
    };
  }

  async addFavorite(courseId: string, userId: string): Promise<boolean> {
    try {
      const existingFavorite = await this.prisma.courseFavorite.findFirst({
        where: {
          userId,
          courseId,
        },
      });
      if (existingFavorite) {
        return true;
      }

      await this.prisma.courseFavorite.create({
        data: {
          userId,
          courseId,
        },
      });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async removeFavorite(courseId: string, userId: string): Promise<boolean> {
    try {
      const existingFavorite = await this.prisma.courseFavorite.findFirst({
        where: {
          userId,
          courseId,
        },
      });
      if (existingFavorite) {
        await this.prisma.courseFavorite.delete({
          where: {
            id: existingFavorite.id,
          },
        });
        return true;
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async getFavorite(courseId: string, userId?: string): Promise<FavoriteResponseDto> {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`${course.id} 코스를 찾지 못했습니다.`);
    }

    if (userId) {
      const existingFavorite = await this.prisma.courseFavorite.findFirst({
        where: {
          userId,
          courseId,
        },
      });
      return {
        isFavorite: !!existingFavorite,
        favoriteCount: course._count.favorites,
      };
    } else {
      return {
        isFavorite: false,
        favoriteCount: course._count.favorites,
      };
    }
  }

  async getMyFavorites(userId: string): Promise<CourseFavoriteEntity[]> {
    const existingFavorites = await this.prisma.courseFavorite.findMany({
      where: {
        userId,
      },
    });

    return existingFavorites as unknown as CourseFavoriteEntity[];
  }
}
