import { builder } from '../schemaBuilder';

const includeNodeEconomicDepositAction = () => {
  builder.prismaNode('EconomicDepositAction', {
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

export default includeNodeEconomicDepositAction;
