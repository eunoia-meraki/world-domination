import { builder } from '../schemaBuilder';

const includeNodeRound = () => {
  builder.prismaNode('Round', {
    findUnique: (id) => ({ id }),
    id: { resolve: (round) => round.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      currentStage: t.exposeInt('currentStage'),
      order: t.exposeInt('order'),
      stages: t.relation('stages'),
      game: t.relation('game'),
      economicDepositActions: t.relation('economicDepositActions'),
      shieldCreationActionActions: t.relation('shieldCreationActionActions'),
      sendBombActions: t.relation('sendBombActions'),
      createBombActions: t.relation('createBombActions'),
      sendDiplomatActions: t.relation('sendDiplomatActions'),
    }),
  });
};

export default includeNodeRound;
