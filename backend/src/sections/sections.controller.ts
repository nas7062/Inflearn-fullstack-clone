import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtPayload } from 'src/types/express';
import { CreateSectionDto } from './dto/create-section-dto copy';
import { Section } from '@prisma/client';
import { SectionDto } from 'src/courses/dto/section-course-dot';
import { UpdateSectionDto } from './dto/update-section-dto';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post('courses/:courseId/sections')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '섹션 생성' })
  @ApiParam({ name: 'courseId', description: '코스 ID' })
  @ApiBody({ type: CreateSectionDto })
  @ApiOkResponse({ description: '섹션 생성 성공', type: SectionDto })
  create(
    @Req() req: Request & { user: JwtPayload },
    @Param('courseId') courseId: string,
    @Body() createSectionDto: CreateSectionDto,
  ): Promise<Section> {
    return this.sectionsService.create(req.user.sub, courseId, createSectionDto);
  }

  @Get(':sectionId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '섹션 상세 조회' })
  @ApiParam({ name: 'sectionId', description: '섹션 ID' })
  @ApiOkResponse({ description: '섹션 상세 조회 성공', type: SectionDto })
  findOne(
    @Req() req: Request & { user: JwtPayload },
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
  ): Promise<Section> {
    return this.sectionsService.findOne(sectionId, req.user.sub);
  }

  @Patch(':sectionId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '섹션 수정' })
  @ApiParam({ name: 'sectionId', description: '섹션 ID' })
  @ApiBody({ type: UpdateSectionDto })
  @ApiOkResponse({ description: '섹션 수정 성공', type: SectionDto })
  update(
    @Req() req: Request & { user: JwtPayload },
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    return this.sectionsService.update(sectionId, req.user.sub, updateSectionDto);
  }

  @Delete(':sectionId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '섹션 삭제' })
  @ApiParam({ name: 'sectionId', description: '섹션 ID' })
  @ApiOkResponse({ description: '섹션 삭제 성공', type: SectionDto })
  delete(
    @Req() req: Request & { user: JwtPayload },
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
  ): Promise<Section> {
    return this.sectionsService.delete(sectionId, req.user.sub);
  }
}
