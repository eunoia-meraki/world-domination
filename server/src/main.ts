import { ApolloServer } from 'apollo-server';
import { getAuthorizedUserAsync } from './auth';
import { schema } from './graphql/schema';

const PORT = process.env.PORT || 8001;

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    user: getAuthorizedUserAsync(req.headers.authorization || ''),
  }),
});

server.listen(PORT, (error: unknown) => {
  if (error) {
    throw error;
  }

  console.log(`Server started at http://127.0.0.1:${PORT}`);
});
