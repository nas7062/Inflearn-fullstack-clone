import { Injectable } from '@nestjs/common';
import { Course } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId : string , createCourseDto : CreateCourseDto) : Promise<Course> {
     return this.prisma.course.create({
        data : {
            ...createCourseDto,
            instructorId : userId,
        }
     })   
  }
}
