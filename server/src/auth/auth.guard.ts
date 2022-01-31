import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from 'src/models/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = GqlExecutionContext.create(context).getContext();
    try {
      const authHeader = req.headers.authorization;

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      const user = this.jwtService.verify(token);
      const dbUser = await this.userService.findOneById(user.id);
      if (!dbUser) {
        throw new UnauthorizedException({
          message: 'Ошибка авторизации',
        });
      }

      req.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException({
        message: `Пользователь не авторизован\n${e.message}`,
      });
    }
  }
}
