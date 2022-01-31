import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignUpInput } from 'src/auth/dto/signup.input';

import { AuthService } from '../auth/auth.service';
import { SignInInput } from './dto/signin.input';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async signUp(@Args('input') input: SignUpInput) {
    return this.authService.signUp(input);
  }

  @Mutation(() => String)
  async signIn(@Args('input') input: SignInInput) {
    return this.authService.signIn(input);
  }
}
