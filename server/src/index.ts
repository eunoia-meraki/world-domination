import { init } from './app';

const PORT = process.env.PORT || '8001';
const ENDPOINT = '/graphql';

init(PORT, ENDPOINT)
  .then((server) => {
    console.log(
      `Server started on: http://localhost:${PORT}\nGraphQL endpoint: http://localhost:${PORT}${ENDPOINT}`,
    );
    return server;
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  });
