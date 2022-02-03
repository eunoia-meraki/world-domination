import * as path from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { schema } from './schema';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'webapp'),
      exclude: ['/graphql'],
    }),
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      schema,
      // context: ({ req }) => ({ headers: req.headers }),
    }),
  ],
})
export class AppModule {}
