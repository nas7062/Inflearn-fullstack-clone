import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from 'src/courses/dto/category-course-dto';

@ApiTags('카테고리')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('')
  @ApiOperation({ summary: '카테고리 목록 조회' })
  @ApiOkResponse({ description: '카테고리 목록 조회 성공 ', type: CategoryDto, isArray: true })
  findAll() {
    return this.categoriesService.findAll();
  }
  
}
