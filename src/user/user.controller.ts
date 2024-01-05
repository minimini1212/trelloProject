import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 정보 조회 API
   * @param req
   * @returns {Object} statusCode, message, user
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async findMe(@Request() req) {
    const userId = req.user.id;

    const user = await this.userService.findById(userId);

    return {
      statusCode: HttpStatus.OK,
      message: '사용자 정보 조회에 성공했습니다.',
      user,
    };
  }
}
