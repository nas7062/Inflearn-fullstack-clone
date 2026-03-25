import { Injectable } from '@nestjs/common';
import { CategoryDto } from 'src/courses/dto/category-course-dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.courseCategory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
