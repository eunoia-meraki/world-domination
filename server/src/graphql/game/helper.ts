import { Game, GameStatus, Player, Team } from '@prisma/client';
import { GQLContext } from '../../app';
import { db } from '../../database/db';
import { broadcastGame } from './subscriptions';

const startingGame: Map<string, NodeJS.Timeout> = new Map();

export const startGame = async (ctx: GQLContext, game: Game) => {
  const gameUpdated = await db.game.update({
    where: { id: game.id },
    data: { status: GameStatus.ON_STARTING },
  });

  const timeout = setTimeout(async () => {
    const gameUpdated = await db.game.update({
      where: { id: game.id },
      data: { status: GameStatus.ON_GOING },
    });

    broadcastGame(ctx, gameUpdated);
  }, 10000);

  startingGame.set(game.id, timeout);

  return gameUpdated;
  // broadcastGame(ctx, gameUpdated);
};

export const stopGameStarting = async (
  ctx: GQLContext,
  game: Game & {
    teams: (Team & {
      players: Player[];
    })[];
  },
) => {
  const timeout = startingGame.get(game.id);
  if (!timeout) {
    return game;
  }
  clearTimeout(timeout);
  startingGame.delete(game.id);

  const gameUpdated = await db.game.update({
    where: { id: game.id },
    data: { status: GameStatus.NOT_STARTED },
    include: { teams: { include: { players: true } } },
  });

  return gameUpdated;
  // broadcastGame(ctx, gameUpdated);
};
