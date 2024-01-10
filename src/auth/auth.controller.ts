import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Request,
  UseGuards,
  Headers,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dtos/sign-in.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입 API
   * @param {SignUpDto} signUpDto
   * @returns {Object} statusCode, message, user
   */
  @Post('/signup')
  @UseInterceptors(FileInterceptor('image'))
  async signUp(
    @UploadedFile() image,
    @Body() signUpDto: SignUpDto,
  ): Promise<object> {
    signUpDto.imagePath = image ? image.filename : null;

    const data = await this.authService.signup(signUpDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: '회원가입에 성공했습니다.',
      data,
    };
  }

  /**
   * 로그인 API
   * @param req
   * @param {SignInDto} signInDto
   * @returns {Object} statusCode, message, data
   */
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  signIn(@Request() req: any, signInDto: SignInDto): object {
    const data = this.authService.signIn(req.user.id);

    return {
      statusCode: HttpStatus.OK,
      message: '로그인에 성공했습니다.',
      data,
    };
  }

  /**
   * 엑세스 토큰 재발급 API
   * @param refreshToken
   * @returns {Object} statusCode, message, accessToken
   */
  @UseGuards(AuthGuard('refresh'))
  @Post('/refresh')
  async refresh(@Headers('refresh-token') refreshToken: string) {
    const accessToken = await this.authService.refreshToken(refreshToken);

    return {
      statusCode: HttpStatus.OK,
      message: '토큰 재발급에 성공했습니다.',
      accessToken,
    };
  }

  /**
   * 회원 탈퇴 API
   * @param refreshToken
   * @returns {Object} statusCode, message
   */
  @UseGuards(AuthGuard('refresh'))
  @Delete('/unregister')
  async unregister(
    @Headers('refresh-token') refreshToken: string,
  ): Promise<Object> {
    await this.authService.unregister(refreshToken);

    return {
      statusCode: HttpStatus.OK,
      message: '회원탈퇴에 성공했습니다.',
    };
  }
}
