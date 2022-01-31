import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignUpInput {
  @Field(() => String)
  login: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  nickname: string;

  @Field(() => String)
  email: string;
}
