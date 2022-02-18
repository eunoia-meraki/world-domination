import { GameActionType } from '@prisma/client';
import { builder } from '../schemaBuilder';

const includeAction = () => {
  builder.prismaNode('GameAction', {
    findUnique: (id) => ({ id }),
    id: { resolve: (action) => action.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      type: t.expose('type', { type: GameActionType }),
      round: t.relation('round'),
      team: t.relation('team'),
      economicDepositAction: t.relation('economicDepositAction'),
      shieldCreationAction: t.relation('shieldCreationAction'),
      sendBombAction: t.relation('sendBombAction'),
      createBombAction: t.relation('createBombAction'),
      ecologyDepositAction: t.relation('ecologyDepositAction'),
      developNuclearTechnologyAction: t.relation(
        'developNuclearTechnologyAction',
      ),
      sanctionsAction: t.relation('sanctionAction'),
    }),
  });
};

export default includeAction;
