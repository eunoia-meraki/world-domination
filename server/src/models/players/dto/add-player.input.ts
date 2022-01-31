import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddPlayerInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  nickname: string;
}
