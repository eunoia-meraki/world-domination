import { builder } from '../schemaBuilder';

const includeNodeSanctionsAction = () => {
  builder.prismaNode('SanctionsAction', {
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

export default includeNodeSanctionsAction;
