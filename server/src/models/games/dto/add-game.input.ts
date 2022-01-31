import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddGameInput {
  @Field(() => [String])
  readonly userIds: string[];
}
