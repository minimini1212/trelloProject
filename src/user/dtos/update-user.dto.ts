import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PickType(User, [
  'name',
  'description',
  'password',
  'imagePath',
]) {
  @IsNotEmpty({ message: '비밀번호 재확인을 입력해주세요.' })
  @IsString()
  passwordConfirm: string;
}
