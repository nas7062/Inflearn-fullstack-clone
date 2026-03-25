import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { createLectureDto } from './dto/create-lecture-dto';
import { Lecture } from '@prisma/client';
import { JwtPayload } from 'src/types/express';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { updateLectureDto } from './dto/update-lecture-dto';

@Controller('lectures')
@ApiTags('강의')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Post('sections/:sectionId/lectures')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '강의 생성' })
  @ApiParam({ name: 'sectionId', description: '섹션 ID' })
  @ApiBody({ type: createLectureDto })
  @ApiOkResponse({ description: '강의 생성 성공', type: createLectureDto })
  create(
    @Req() req: Request & { user: JwtPayload },
    @Param('sectionId') sectionId: string,
    @Body() createLectureDto: createLectureDto,
  ): Promise<Lecture> {
    return this.lecturesService.create(sectionId, createLectureDto, req.user.sub);
  }

  @Get(':lectureId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '강의 상세 조회' })
  @ApiParam({ name: 'lectureId', description: '강의 ID' })
  @ApiOkResponse({ description: '강의 상세 조회 성공', type: createLectureDto })
  findOne(
    @Req() req: Request & { user: JwtPayload },
    @Param('lectureId', ParseUUIDPipe) lectureId: string,
  ): Promise<Lecture> {
    return this.lecturesService.findOne(lectureId, req.user.sub);
  }

  @Patch(':lectureId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '강의 수정' })
  @ApiParam({ name: 'lectureId', description: '강의 ID' })
  @ApiBody({ type: updateLectureDto })
  @ApiOkResponse({ description: '강의 수정 성공', type: createLectureDto })
  update(
    @Req() req: Request & { user: JwtPayload },
    @Param('lectureId', ParseUUIDPipe) lectureId: string,
    @Body() updateLectureDto: updateLectureDto,
  ): Promise<Lecture> {
    return this.lecturesService.update(lectureId, req.user.sub, updateLectureDto);
  }

  @Delete(':lectureId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '강의 삭제' })
  @ApiParam({ name: 'lectureId', description: '강의 ID' })
  @ApiOkResponse({ description: '강의 삭제 성공', type: createLectureDto })
  delete(
    @Req() req: Request & { user: JwtPayload },
    @Param('lectureId', ParseUUIDPipe) lectureId: string,
  ): Promise<Lecture> {
    return this.lecturesService.delete(lectureId, req.user.sub);
  }
}
