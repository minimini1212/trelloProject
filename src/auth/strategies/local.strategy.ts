import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<{ id: number }> {
    const user = await this.authService.validateUser({ email, password });

    if (user === 'USER_NOT_FOUND') {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    } else if (user === 'INVALID_PASSWORD') {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    } else {
      return user;
    }
  }
}
