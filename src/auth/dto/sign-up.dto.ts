import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class SignUpDto extends PickType(User, [
  'email',
  'password',
  'name',
  'imagePath',
  'description',
]) {
  @IsNotEmpty({ message: '비밀번호 재확인을 입력해주세요.' })
  @IsString()
  passwordConfirm: string;
}
