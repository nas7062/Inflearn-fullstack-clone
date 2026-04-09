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
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CreateCourseDto } from './dto/create-course-dto';
import { JwtPayload } from 'src/types/express';
import { Course, Prisma } from '@prisma/client';
import { UpdateCourseDto } from './dto/update-course-dto';
import { CourseResponseDto } from './dto/response-course-dto';
import { SearchCourseResponseDto } from './dto/search-response-dto';
import { SearchCourseDto } from './dto/search-coures-dto';
import { CourseDetailDto } from './dto/course-detail-dto';
import { AddFavoriteResponseDto } from './dto/add-favorite-dto';
import { OptionalAccessTokenGuard } from 'src/auth/guards/optinal-access-token.guard';
import { FavoriteResponseDto } from './dto/favorite-dto';

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

  @Get('search')
  @ApiOkResponse({
    description: '코스 검색',
    type: SearchCourseResponseDto,
  })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'charge', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['price'] })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, default: 1 })
  @ApiQuery({ name: 'pageSize', required: false, default: 20 })
  search(@Query() searchCourseDto: SearchCourseDto): Promise<SearchCourseResponseDto> {
    return this.coursesService.searchCourses(searchCourseDto);
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
  @ApiQuery({ required: false, description: '코스 상세 조회' })
  @ApiOkResponse({ description: '코스 상세 조회', type: CourseDetailDto })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
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

  @Post(':id/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '코스 즐겨찾기 추가' })
  @ApiOkResponse({ description: '코스 즐겨찾기 추가 성공', type: Boolean })
  addFavorite(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request & { user: JwtPayload }) {
    return this.coursesService.addFavorite(id, req.user.sub);
  }

  @Delete(':id/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '코스 즐겨찾기 삭제' })
  @ApiOkResponse({ description: '코스 즐겨찾기 삭제 성공', type: Boolean })
  removeFavorite(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request & { user: JwtPayload }) {
    return this.coursesService.removeFavorite(id, req.user.sub);
  }

  @Get(':id/favorite')
  @UseGuards(OptionalAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '코스 즐겨찾기 조회' })
  @ApiOkResponse({ description: '코스 즐겨찾기 조회 성공', type: FavoriteResponseDto })
  getFavorite(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request & { user: JwtPayload }) {
    return this.coursesService.getFavorite(id, req.user.sub);
  }

  @Get('favorites/my')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '내 즐겨찾기 조회' })
  @ApiOkResponse({ description: '내 즐겨찾기 조회 성공', type: FavoriteResponseDto, isArray: true })
  getFavorites(@Req() req: Request & { user: JwtPayload }) {
    return this.coursesService.getMyFavorites(req.user.sub);
  }
}
