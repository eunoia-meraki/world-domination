import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Field, ID, ObjectType } from '@nestjs/graphql';

export type GameDocument = Game & Document;

@ObjectType({ description: 'game' })
@Schema()
export class Game {
  @Field((type) => ID, { name: 'id' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: string;

  @Field()
  @Prop({ default: Date.now() })
  date: Date;

  @Field((type) => [User])
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  users: User[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
