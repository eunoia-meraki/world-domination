import { WDSchemaBuilder } from '../schemaBuilder';

const includeNodeCreateBombAction = (builder: WDSchemaBuilder) => {
  builder.prismaNode('CreateBombAction', {
    findUnique: (id) => ({ id }),
    id: { resolve: (action) => action.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      creator: t.relation('creator'),
      player: t.relation('player'),
      round: t.relation('round'),
    }),
  });
};

export default includeNodeCreateBombAction;
