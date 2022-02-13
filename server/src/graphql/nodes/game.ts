import { GameStatus } from '@prisma/client';
import { builder } from '../schemaBuilder';

const includeNodeGame = () => {
  builder.prismaNode('Game', {
    findUnique: (id) => ({ id }),
    id: { resolve: (game) => game.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      name: t.exposeString('name'),
      status: t.expose('status', { type: GameStatus }),
      clients: t.relation('clients'),
      owner: t.relation('owner'),
      teams: t.relation('teams'),
      currentRound: t.exposeInt('currentRound'),
      ecologyValue: t.exposeInt('ecologyValue'),
      rounds: t.relation('rounds'),
    }),
  });
};

export default includeNodeGame;
