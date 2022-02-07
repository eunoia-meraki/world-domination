import { WDSchemaBuilder } from '../schemaBuilder';

const includeNodeShieldCreationAction = (builder: WDSchemaBuilder) => {
  builder.prismaNode('ShieldCreationAction', {
    findUnique: (id) => ({ id }),
    id: { resolve: (action) => action.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      town: t.relation('town'),
      player: t.relation('player'),
      round: t.relation('round'),
    }),
  });
};

export default includeNodeShieldCreationAction;
