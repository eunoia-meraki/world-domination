import { GameStatus } from '@prisma/client';
import { db } from '../../database/db';
import { builder } from '../schemaBuilder';

const includeNodeUser = () => {
  builder.prismaNode('User', {
    findUnique: (id) => ({ id }),
    id: { resolve: (user) => user.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      login: t.exposeString('login'),
      currentGame: t.relation('currentGame', { nullable: true }),
      availableGames: t.prismaConnection({
        authScopes: {
          public: true,
        },
        type: 'Game',
        cursor: 'id',
        resolve: async (query) => {
          return db.game.findMany({
            ...query,
            where: {
              status: GameStatus.NOT_STARTED,
            },
          });
        },
      }),
    }),
  });
};

export default includeNodeUser;
