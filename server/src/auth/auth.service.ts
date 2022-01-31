import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignUpInput } from 'src/auth/dto/signup.input';
import { User } from 'src/models/users/schemas/user.schema';
import { UsersService } from 'src/models/users/users.service';
import { SignInInput } from './dto/signin.input';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(payload: SignInInput) {
    const user = await this.validateUser(payload);
    return (await this.generateToken(user)).token;
  }

  async signUp(payload: SignUpInput) {
    const candidate = (
      await this.userService.filter({ login: payload.login })
    )?.[0];

    if (candidate) {
      throw new HttpException(
        'Пользователь с таким login существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(payload.password, 5);
    const user = await this.userService.create({
      ...payload,
      password: hashPassword,
    });

    return (await this.generateToken(user)).token;
  }

  private async generateToken(user: User) {
    const payload = { login: user.login, id: user._id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(payload: SignInInput) {
    const user = (await this.userService.filter({ login: payload.login }))?.[0];
    const passwordEquals = await bcrypt.compare(
      payload.password,
      user?.password || '',
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Некорректный логин или пароль',
    });
  }
}
