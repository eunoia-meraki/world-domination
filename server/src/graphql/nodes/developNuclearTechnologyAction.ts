import { builder } from '../schemaBuilder';

const includeNodeDevelopNuclearTechnologyAction = () => {
  builder.prismaNode('DevelopNuclearTechnologyAction', {
    findUnique: (id) => ({ id }),
    id: { resolve: (action) => action.id },
    authScopes: {
      public: true,
    },
  });
};

export default includeNodeDevelopNuclearTechnologyAction;
