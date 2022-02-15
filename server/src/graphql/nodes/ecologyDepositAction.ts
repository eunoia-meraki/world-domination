import { builder } from '../schemaBuilder';

const includeNodeEcologyDepositAction = () => {
  builder.prismaNode('EcologyDepositAction', {
    findUnique: (id) => ({ id }),
    id: { resolve: (action) => action.id },
    authScopes: {
      public: true,
    },
  });
};

export default includeNodeEcologyDepositAction;
