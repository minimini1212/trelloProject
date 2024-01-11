import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return {
      name: user.name,
      image: user.imagePath,
      email: user.email,
      description: user.description,
    };
  }

  async update(id: number, imagePath: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'password', 'description', 'imagePath'],
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (updateUserDto.password !== updateUserDto.passwordConfirm) {
      throw new BadRequestException(
        '비밀번호와 비밀번호 재확인이 일치하지 않습니다.',
      );
    }

    const isValidPassword = await bcrypt.compare(
      updateUserDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    await this.userRepository.update(id, {
      name: updateUserDto.name,
      description: updateUserDto.description,
      imagePath,
    });

    return {
      name: updateUserDto.name,
      image: updateUserDto.imagePath,
      email: user.email,
      description: updateUserDto.description,
    };
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }
}
