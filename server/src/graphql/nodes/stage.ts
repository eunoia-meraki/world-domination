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
      startDate: t.field({
        type: 'Date',
        nullable: true,
        resolve: async (s) => s.startDate,
      }),
    }),
  });
};

export default includeNodeStage;
