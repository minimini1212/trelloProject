import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signup({ email, name, password, passwordConfirm }: SignUpDto) {
    const existedUser = await this.userRepository.findOneBy({ email });

    if (existedUser) {
      throw new BadRequestException('이미 가입된 이메일입니다.');
    }

    const isPasswordMatched = password === passwordConfirm;

    if (!isPasswordMatched) {
      throw new BadRequestException(
        '비밀번호와 비밀번호 재확인이 일치하지 않습니다.',
      );
    }

    const hashRound = this.configService.get<number>('PASSWORD_HASH_ROUNDS');
    const hashedPassword = bcrypt.hashSync(password, hashRound);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
    });

    return this.signIn(user.id);
  }

  signIn(id: number) {
    const payload = { id };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    this.userRepository.update(id, { refreshToken });

    return { accessToken, refreshToken };
  }

  async validateUser({ email, password }: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });

    const isPasswordMatched = bcrypt.compareSync(
      password,
      user?.password ?? '',
    );

    if (!user) {
      return 'USER_NOT_FOUND';
    } else if (!isPasswordMatched) {
      return 'INVALID_PASSWORD';
    } else {
      return { id: user.id };
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const { id } = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOneBy({ id });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('토큰이 유효하지 않습니다.');
      }

      const accessToken = this.jwtService.sign({ id });

      return { accessToken };
    } catch (err) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }
  }
}
