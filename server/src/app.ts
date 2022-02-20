import { User } from '@prisma/client';
import * as express from 'express';
import { PubSub } from 'graphql-subscriptions';
import { ApolloServer } from 'apollo-server-express';
import { getAuthorizedUserAsync } from './auth';
import { pubsub } from './pubsub';
import getGraphQLSchema from './graphql/schema';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

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

  app.get('*', (req, res, next) => {
    if (req.url === graphqlPath) {
      return next();
    }

    res.sendFile(__dirname + '/clientApp/index.html');
  });

  apolloServer.applyMiddleware({ app, path: graphqlPath });

  const server = app.listen(gqlPort, () => {
    SubscriptionServer.create(
      {
        schema,
        execute,
        subscribe,
        onOperation: async (message, params) => {
          const token = message?.payload?.variables?.token;

          if (!token) {
            throw new Error('Unauthorized');
          }

          const context = await makeContext(pubsub, token);
          if (!context.user) {
            throw new Error('Unauthorized');
          }

          return {
            ...params,
            context,
          };
        },
      },
      {
        server,
        path: graphqlPath,
      },
    );
  });

  return apolloServer;
};
