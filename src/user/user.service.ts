import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashService } from 'src/common/security/hash.service';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async failIfEmailExists(email: string) {
    const exists = await this.userRepository.existsBy({
      email,
    });

    if (exists) {
      throw new ConflictException('Email ja está em uso');
    }
  }

  async findOneByOrFail(userData: Partial<User>) {
    const user = await this.userRepository.findOneBy(userData);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async create(userDTO: CreateUserDto): Promise<ResponseUserDto> {
    const { password } = userDTO;

    const hashedPassword = await this.hashService.hash(password);

    const user = this.userRepository.create({
      ...userDTO,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.userRepository.save(user);

      return plainToInstance(ResponseUserDto, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch (error: unknown) {
      if (this.isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException('Email já está em uso');
      }

      throw new InternalServerErrorException(
        'Erro ao criar usuário. Tente novamente mais tarde.',
      );
    }
  }

  private isDatabaseError(error: unknown): error is { code: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as { code: unknown }).code === 'string'
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async save(user: User) {
    return await this.userRepository.save(user);
  }

  async update(id: string, userDto: UpdateUserDto) {
    if (!userDto.name && !userDto.email) {
      throw new BadRequestException('Dados não enviados');
    }

    const user = await this.findOneByOrFail({ id });

    user.name = userDto.name ?? user.name;

    if (userDto.email && userDto.email !== user.email) {
      await this.failIfEmailExists(userDto.email);
      user.email = userDto.email;
      user.forceLogout = true;
    }

    const savedUser = this.save(user);

    return plainToInstance(ResponseUserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }
}
