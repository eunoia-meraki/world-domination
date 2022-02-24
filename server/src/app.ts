import { User } from '@prisma/client';
import * as express from 'express';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import { PubSub } from 'graphql-subscriptions';
import { ApolloServer } from 'apollo-server-express';
import { getAuthorizedUserAsync } from './auth';
import { pubsub } from './pubsub';
import getGraphQLSchema from './graphql/schema';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import * as path from 'path';

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

interface IConfig {
  ssl: boolean;
  ssl_key: string;
  ssl_crt: string;
  hostname: string;
  port: string;
  graphql_endpoint: string;
}

export const init = async (config: IConfig): Promise<ApolloServer> => {
  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req }) =>
      makeContext(pubsub, req.headers.authorization || ''),
  });

  await apolloServer.start();

  const app = express();

  app.use(express.static(path.join(__dirname, 'clientApp')));

  app.get('/*', function (req, res, next) {
    if (req.url === config.graphql_endpoint) {
      return next();
    }

    res.sendFile(path.join(__dirname, 'clientApp', 'index.html'));
  });

  apolloServer.applyMiddleware({ app, path: config.graphql_endpoint });

  const server = config.ssl
    ? https.createServer(
        {
          // Assumes certificates are in .ssl folder from package root. Make sure the files
          // are secured.
          key: fs.readFileSync(config.ssl_key),
          cert: fs.readFileSync(config.ssl_crt),
        },
        app,
      )
    : http.createServer(app);

  server.listen(config.port, () => {
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
        path: config.graphql_endpoint,
      },
    );
  });

  return apolloServer;
};
