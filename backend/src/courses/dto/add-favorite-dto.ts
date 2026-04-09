import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteResponseDto {
  @ApiProperty({ description: '즐겨찾기 여부', type: Boolean })
  isFavorite: boolean;
}
