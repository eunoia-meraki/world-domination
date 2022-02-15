import { builder } from '../schemaBuilder';

const includeNodeShieldCreationAction = () => {
  builder.prismaNode('ShieldCreationAction', {
    findUnique: (id) => ({ id }),
    id: { resolve: (action) => action.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      town: t.relation('town'),
      action: t.relation('action'),
    }),
  });
};

export default includeNodeShieldCreationAction;
