import { User } from '@prisma/client';
import { WebSocketServer } from 'ws';
import * as express from 'express';
import { PubSub } from 'graphql-subscriptions';
import { ApolloServer } from 'apollo-server-express';
import { useServer } from 'graphql-ws/lib/use/ws';
import { getAuthorizedUserAsync } from './auth';
import { pubsub } from './pubsub';
import getGraphQLSchema from './graphql/schema';

const schema = getGraphQLSchema();

export interface GQLContext {
  pubsub: PubSub;
  user: User | null;
}

const makeContext = async (
  pubsub: PubSub,
  authorization: string,
): Promise<GQLContext> => {
  return {
    pubsub,
    user: await getAuthorizedUserAsync(authorization),
  };
};

export const init = async (
  gqlPort: string,
  graphqlPath: string,
): Promise<ApolloServer> => {
  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req }) =>
      makeContext(pubsub, req.headers.authorization || ''),
  });

  await apolloServer.start();

  const app = express();

  apolloServer.applyMiddleware({ app, path: graphqlPath });

  const server = app.listen(gqlPort, () => {
    const wsServer = new WebSocketServer({
      server,
      path: graphqlPath,
    });

    useServer(
      {
        schema,
        onConnect: () => console.log('ws: connected'),
        onDisconnect: () => console.log('ws: disconnected'),
        context: (ctx) =>
          makeContext(pubsub, `${ctx.connectionParams?.Authorization}`),
      },
      wsServer,
    );
  });

  return apolloServer;
};
