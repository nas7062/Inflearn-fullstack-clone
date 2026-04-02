import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UserInfoDto {
  @IsString()
  id: string;

  @ApiProperty({ description: '이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty({ description: '이메일', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
  @ApiProperty({ description: '프로필 이미지 URL', required: false })
  @IsOptional()
  @IsString()
  image?: string;
  @ApiProperty({ description: '자기소개', required: false })
  @IsOptional()
  @IsString()
  bio?: string;
  @ApiProperty({ description: '이메일 인증', required: false })
  @IsOptional()
  emailVerified?: Date;
}
