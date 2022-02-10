import { builder } from '../schemaBuilder';

const includeNodeStage = () => {
  builder.prismaNode('Stage', {
    findUnique: (id) => ({ id }),
    id: { resolve: (stage) => stage.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      livetime: t.exposeInt('livetime'),
      order: t.exposeInt('order'),
      round: t.relation('round'),
    }),
  });
};

export default includeNodeStage;
