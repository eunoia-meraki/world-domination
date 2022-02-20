import { Game } from '@prisma/client';
import { GQLContext } from '../../app';
import { db } from '../../database/db';
import { builder, decodeGlobalID } from '../schemaBuilder';

export const gameSubscription = builder.subscriptionField(
  'gameSubscription',
  (t) =>
    t.prismaField({
      authScopes: {
        public: true,
      },
      args: {
        gameId: t.arg.string({ required: true }),
      },
      type: 'Game',
      subscribe: (_, { gameId }, ctx) => {
        console.log('gameSub', decodeGlobalID(gameId));
        return ctx.pubsub.asyncIterator(decodeGlobalID(gameId).id) as any;
      },
      resolve: (_, game) => {
        return game as Game;
      },
    }),
);

export const broadcastGame = async (ctx: GQLContext) => {
  const userId = ctx.user?.id;

  if (!userId) {
    throw new Error('Ctx user id is null');
  }

  const dbUser = await db.user.findFirst({
    where: { id: userId },
    include: { currentGame: true },
  });

  if (!dbUser) {
    throw new Error('Db user is null');
  }

  const game = dbUser?.currentGame;
  console.log('broadcastGame', game?.id);

  if (game) {
    ctx.pubsub.publish(game.id, game);
  }
};
