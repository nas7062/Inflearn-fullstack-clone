import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtPayload } from 'src/types/express';
import { UserInfoDto } from './dto/response-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '코스 수정',
    type: UserInfoDto,
  })
  getProfile(@Req() req: Request & { user: JwtPayload }) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Patch('profile')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '코스 수정',
    type: UserInfoDto,
  })
  updateProfile(@Req() req: Request & { user: JwtPayload }, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.sub, updateUserDto);
  }
}
