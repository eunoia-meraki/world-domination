import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../models/users/users.module';
import { AuthResolver } from './auth.resolver';

import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
    }),
  ],
  providers: [AuthService, AuthResolver],
  exports: [JwtModule],
})
export class AuthModule {}
