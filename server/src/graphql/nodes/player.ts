import { WDSchemaBuilder } from '../schema_builder';

const includeNodePlayer = (builder: WDSchemaBuilder) => {
  builder.prismaNode('Player', {
    findUnique: (id) => ({ id }),
    id: { resolve: (user) => user.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      users: t.relation('user'),
      roles: t.relation('role'),
    }),
  });
};

export default includeNodePlayer;
