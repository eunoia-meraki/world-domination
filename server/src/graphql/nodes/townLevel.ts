import { builder } from '../schemaBuilder';

const includeNodeTownLevel = () => {
  builder.prismaNode('TownLevel', {
    findUnique: (id) => ({ id }),
    id: { resolve: (townLevel) => townLevel.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      order: t.exposeInt('order'),
      incomePerRound: t.exposeInt('incomePerRound'),
      upgradeCost: t.exposeInt('upgradeCost'),
      livingLevel: t.exposeInt('livingLevel'),
      towns: t.relation('towns'),
    }),
  });
};

export default includeNodeTownLevel;
