import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesModule } from './models/games/games.module';
import { PlayersModule } from './models/players/players.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
    }),
    PlayersModule,
    GamesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
