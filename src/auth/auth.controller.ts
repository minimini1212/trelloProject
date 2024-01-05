import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Request,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입 API
   * @param {SignUpDto} signUpDto
   * @returns {Object} statusCode, message, user
   */
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<object> {
    const user = await this.authService.signup(signUpDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: '회원가입에 성공했습니다.',
      user,
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
  @Post('/refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    const accessToken = await this.authService.refreshToken(refreshToken);

    return {
      statusCode: HttpStatus.OK,
      message: '토큰 재발급에 성공했습니다.',
      accessToken,
    };
  }
}
