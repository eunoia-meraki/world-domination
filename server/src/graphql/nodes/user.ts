import { db } from '../../database/db';
import { WDSchemaBuilder } from '../schema_builder';

const includeNodeUser = (builder: WDSchemaBuilder) => {
  builder.prismaNode('User', {
    findUnique: (id) => ({ id }),
    id: { resolve: (user) => user.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      login: t.exposeString('login'),
      passwordHash: t.exposeString('passwordHash'),
      players: t.relation('players'),
    }),
  });

  builder.queryType({
    fields: (t) => ({
      users: t.prismaConnection({
        authScopes: {
          public: true,
        },
        type: 'User',
        cursor: 'id',
        resolve: async (query) => {
          return db.user.findMany({
            ...query,
          });
        },
      }),
    }),
  });
};

export default includeNodeUser;
