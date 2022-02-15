import { builder } from '../schemaBuilder';

const includeNodeCreateBombAction = () => {
  builder.prismaNode('CreateBombAction', {
    findUnique: (id) => ({ id }),
    id: { resolve: (action) => action.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      creator: t.relation('creator'),
      action: t.relation('action'),
    }),
  });
};

export default includeNodeCreateBombAction;
