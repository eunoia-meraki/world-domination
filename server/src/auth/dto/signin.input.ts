import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInInput {
  @Field(() => String)
  login: string;

  @Field(() => String)
  password: string;
}
