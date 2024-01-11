import {
  Controller,
  Get,
  Body,
  Request,
  UseGuards,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dtos/update-user.dto';

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
  async findMe(@Request() req: any): Promise<object> {
    const userId = req.user.id;

    const user = await this.userService.findById(userId);

    return {
      statusCode: HttpStatus.OK,
      message: '사용자 정보 조회에 성공했습니다.',
      user,
    };
  }

  /**
   * 사용자 정보 수정 API
   * @param req
   * @param file
   * @param {UpdateUserDto} updateUserDto
   * @returns {Object} statusCode, message, user
   */
  @UseGuards(AuthGuard('jwt'))
  @Put('/me')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Request() req: any,
    @UploadedFile() file,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<object> {
    const userId = req.user.id;
    let imagePath = null;

    if (file) {
      imagePath = file.path;
    }

    const user = await this.userService.update(
      userId,
      imagePath,
      updateUserDto,
    );

    return {
      statusCode: HttpStatus.OK,
      message: '사용자 정보 수정에 성공했습니다.',
      user,
    };
  }
}
