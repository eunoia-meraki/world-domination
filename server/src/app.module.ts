import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './models/games/games.module';
import { UsersModule } from './models/users/users.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'webapp'),
    }),
    GraphQLModule.forRoot({
      debug: process.env.NODE_ENV === 'development',
      playground: process.env.NODE_ENV === 'development',
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ headers: req.headers }),
    }),
    UsersModule,
    GamesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
