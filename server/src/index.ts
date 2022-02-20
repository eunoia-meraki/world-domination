import { init } from './app';

const NODE_ENV = process.env.NODE_ENV || 'development';

const PORT = process.env.PORT || '8001';
const PROD_HOST = process.env.PROD_HOST || 'localhost';
const DEV_HOST = process.env.DEV_HOST || 'localhost';
const SSL_KEY = process.env.SSL_KEY || '';
const SSL_CRT = process.env.SSL_CRT || '';

const GRAPHQL_ENDPOINT = '/graphql';

const configurations = {
  production: {
    ssl: true,
    ssl_key: SSL_KEY,
    ssl_crt: SSL_CRT,
    port: PORT,
    hostname: PROD_HOST,
    graphql_endpoint: GRAPHQL_ENDPOINT,
  },
  development: {
    ssl: false,
    ssl_key: SSL_KEY,
    ssl_crt: SSL_CRT,
    port: PORT,
    hostname: DEV_HOST,
    graphql_endpoint: GRAPHQL_ENDPOINT,
  },
};

const config = configurations[NODE_ENV];

init(config)
  .then((server) => {
    console.log(
      `Server started on: http${config.ssl ? 's' : ''}://${config.hostname}:${
        config.port
      }`,
    );
    console.log(
      `GraphQL endpoint: http${config.ssl ? 's' : ''}://${config.hostname}:${
        config.port
      }${config.graphql_endpoint}`,
    );
    return server;
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  });
