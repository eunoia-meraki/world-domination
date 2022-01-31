import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Game } from '../../games/schemas/game.schema';
import { Field, ID, ObjectType } from '@nestjs/graphql';

export type UserDocument = User & Document;

@ObjectType({ description: 'user' })
@Schema()
export class User {
  @Field((type) => ID, { name: 'id' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: string;

  @Field(() => String)
  @Prop({ unique: true })
  login: string;

  @Field()
  @Prop({ required: true })
  password: string;

  @Field()
  @Prop({ required: true })
  email: string;

  @Field()
  @Prop({ required: true })
  nickname: string;

  @Field((type) => [Game])
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    default: [],
  })
  games: Game[];
}

export const UserSchema = SchemaFactory.createForClass(User);
