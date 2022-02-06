import { WDSchemaBuilder } from '../schema_builder';

const includeNodeRole = (builder: WDSchemaBuilder) => {
  builder.prismaNode('Role', {
    findUnique: (id) => ({ id }),
    id: { resolve: (user) => user.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      name: t.exposeString('name'),
      players: t.relation('players'),
    }),
  });
};

export default includeNodeRole;
