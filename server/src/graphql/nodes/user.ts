import { builder } from '../schemaBuilder';

const includeNodeUser = () => {
  builder.prismaNode('User', {
    findUnique: (id) => ({ id }),
    id: { resolve: (user) => user.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      login: t.exposeString('login'),
      passwordHash: t.exposeString('passwordHash', {
        authScopes: {},
      }),
      players: t.relation('players'),
    }),
  });
};

export default includeNodeUser;
