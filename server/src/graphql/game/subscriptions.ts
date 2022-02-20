import { Game } from '@prisma/client';
import { GQLContext } from '../../app';
import { builder } from '../schemaBuilder';

export const gameSubscription = builder.subscriptionField(
  'gameSubscription',
  (t) =>
    t.prismaField({
      authScopes: {
        public: true,
      },
      type: 'Game',
      subscribe: (_, __, ctx) => {
        if (!ctx.user?.currentGameId) {
          throw new Error('Cannot subscribe on the game');
        }

        console.log(
          `User ${ctx.user.login} subscribed on game ${ctx.user.currentGameId}`,
        );

        return ctx.pubsub.asyncIterator(ctx.user.currentGameId) as any;
      },
      resolve: (_, game) => {
        return game as Game;
      },
    }),
);

export const broadcastGame = async (ctx: GQLContext, game: Game | null) => {
  if (!game) {
    return;
  }

  console.log(`Broadcast game ${game.id} updates`);

  ctx.pubsub.publish(game.id, game);
};
