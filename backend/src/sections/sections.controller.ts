import { Body, Controller, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtPayload } from 'src/types/express';
import { CreateSectionDto } from './dto/create-section-dto copy';
import { Section } from '@prisma/client';
import { SectionDto } from 'src/courses/dto/section-course-dot';

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
}
