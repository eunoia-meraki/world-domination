import { builder } from '../schemaBuilder';

const includeNodeInvestTownAction = () => {
  builder.prismaNode('InvestTownAction', {
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

export default includeNodeInvestTownAction;
