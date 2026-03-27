import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CreateCourseDto } from './dto/create-course-dto';
import { JwtPayload } from 'src/types/express';
import { Course, Prisma } from '@prisma/client';
import { UpdateCourseDto } from './dto/update-course-dto';
import { CourseResponseDto } from './dto/response-course-dto';

@ApiTags('코스')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '코스 생성' })
  @ApiCreatedResponse({ description: '코스 생성 성공', type: CourseResponseDto })
  @ApiOkResponse({ description: '코스 생성 성공', type: CourseResponseDto })
  create(@Req() req: Request & { user: JwtPayload }, @Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(req.user.sub, createCourseDto);
  }

  @Get()
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiOkResponse({ type: [CourseResponseDto] })
  findAll(
    @Query('title') title?: string,
    @Query('level') level?: string,
    @Query('categoryId') categoryId?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<Course[] | undefined> {
    const where: Prisma.CourseWhereInput = {};
    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }
    if (level) {
      where.level = level;
    }
    if (categoryId) {
      where.categories = {
        some: {
          id: categoryId,
        },
      };
    }

    return this.coursesService.findAll({
      where,
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  @Get(':id')
  @ApiParam({ name: 'include', required: false, description: 'section,lectures, review 포함 관계 지정' })
  @ApiOkResponse({ description: '코스 상세 조회', type: CourseResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Query('include') include?: string) {
    const includeArray = include ? include.split(',') : undefined;
    return this.coursesService.findOne(id, includeArray);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.coursesService.update(id, req.user.sub, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request & { user: JwtPayload }) {
    return this.coursesService.remove(id, req.user.sub);
  }
}
