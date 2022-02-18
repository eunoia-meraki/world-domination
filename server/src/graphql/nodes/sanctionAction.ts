import { builder } from '../schemaBuilder';

const includeNodeSanctionAction = () => {
  builder.prismaNode('SanctionAction', {
    findUnique: (id) => ({ id }),
    id: { resolve: (action) => action.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      victim: t.relation('victim'),
      action: t.relation('action'),
    }),
  });
};

export default includeNodeSanctionAction;
