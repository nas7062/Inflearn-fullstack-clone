import { BadRequestException, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtPayload } from 'src/types/express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 300 * 1024 * 1024,
      },
    }),
  )
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: '미디어 업로드 성공' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '미디어 파일',
        },
      },
    },
  })
  uploadMedia(@Req() req: Request & { user: JwtPayload }, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.mediaService.uploadMedia(file, req.user.sub);
  }
}
