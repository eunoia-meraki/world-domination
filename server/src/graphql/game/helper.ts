import { Game, GameStatus, Player, Round, Stage, Team } from '@prisma/client';
import { GQLContext } from '../../app';
import { db } from '../../database/db';
import { broadcastGame } from './subscriptions';

const startingGame: Map<string, NodeJS.Timeout> = new Map();

export const startGame = async (
  ctx: GQLContext,
  game: Game & {
    teams: (Team & {
      players: Player[];
    })[];
    rounds: (Round & {
      stages: Stage[];
    })[];
  },
) => {
  const gameUpdated = await db.game.update({
    where: { id: game.id },
    data: { status: GameStatus.ON_STARTING },
  });

  const timeout = setTimeout(async () => {
    const firstRound = game.rounds.find((round) => round.order == 0);

    if (!firstRound) {
      throw new Error('Первый раунд не найден');
    }

    const firstStage = firstRound.stages.find((stage) => stage.order == 0);

    if (!firstStage) {
      throw new Error('Первая стадия не найдена');
    }

    const updatedStage = await db.stage.update({
      where: { id: firstStage.id },
      data: { startDate: new Date() },
    });

    const gameUpdated = await db.game.update({
      where: { id: game.id },
      data: { status: GameStatus.ON_GOING, currentRound: 0 },
    });

    broadcastGame(ctx, gameUpdated);
    setTimeout(async () => {
      await startNextStage(ctx, game.id);
    }, updatedStage.livetime);
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

const startNextStage = async (ctx: GQLContext, gameId: string) => {
  const game = await db.game.findFirst({
    where: { id: gameId },
    include: { rounds: { include: { stages: true } } },
  });

  if (!game) {
    throw new Error('Текущая игра не найдена');
  }

  const curRound = game?.rounds.find(
    (round) => round.order == game.currentRound,
  );

  if (!curRound) {
    throw new Error('Текущий раунд не найден');
  }

  const curStage = curRound?.stages.find(
    (stage) => stage.order === curRound.currentStage,
  );

  if (!curStage) {
    throw new Error('Текущая стадия не найдена');
  }

  const isLastStage =
    curRound.currentStage ==
    Math.max(...curRound.stages.map((stage) => stage.order));

  const isLastRound =
    game.currentRound == Math.max(...game.rounds.map((round) => round.order));

  if (isLastRound && isLastStage) {
    const updatedGame = await db.game.update({
      where: { id: game.id },
      data: { status: GameStatus.ENDED },
    });

    await updateTeamsVoiceChatId(ctx, updatedGame.id);
    broadcastGame(ctx, await db.game.findFirst({ where: { id: game.id } }));

    return;
  }

  if (isLastStage) {
    const updatedGame = await db.game.update({
      where: { id: game.id },
      data: { currentRound: curRound.order + 1 },
      include: { rounds: { include: { stages: true } } },
    });

    const firstStage = updatedGame.rounds
      .find((round) => round.order == updatedGame.currentRound)
      ?.stages.find((stage) => stage.order == 0);

    if (!firstStage) {
      throw new Error('Первая стадия не найдена');
    }

    await db.stage.update({
      where: { id: firstStage.id },
      data: { startDate: new Date() },
    });

    await updateTeamsVoiceChatId(ctx, updatedGame.id);
    broadcastGame(ctx, await db.game.findFirst({ where: { id: game.id } }));

    setTimeout(async () => {
      await startNextStage(ctx, game.id);
    }, firstStage.livetime);

    return;
  }

  const updatedRound = await db.round.update({
    where: { id: curRound.id },
    data: { currentStage: curRound.currentStage + 1 },
    include: { stages: true },
  });

  const newStage = updatedRound.stages.find(
    (stage) => stage.order == updatedRound.currentStage,
  );

  if (!newStage) {
    throw new Error('Новая стадия не найдена');
  }

  const updatedStage = await db.stage.update({
    where: { id: newStage.id },
    data: { startDate: new Date() },
  });

  await updateTeamsVoiceChatId(ctx, game.id);
  broadcastGame(ctx, await db.game.findFirst({ where: { id: game.id } }));

  setTimeout(async () => {
    await startNextStage(ctx, game.id);
  }, newStage.livetime);
};

const updateTeamsVoiceChatId = async (ctx: GQLContext, gameId: string) => {
  const game = await db.game.findFirst({
    where: { id: gameId },
    include: {
      teams: { include: { players: true, teamRoom: true } },
      rounds: { include: { stages: true } },
    },
  });

  if (!game) {
    throw new Error('Текущая игра не найдена');
  }

  const curRound = game.rounds.find(
    (round) => game.currentRound === round.order,
  );
  const curStage = curRound?.stages.find(
    (stage) => curRound.currentStage === stage.order,
  );

  if (!curStage) {
    throw new Error('Текущая стадия игры не найдена');
  }

  const isPrivateStage = curStage.order === 1;
  console.log(curStage.order);

  if (isPrivateStage) {
    await Promise.all(
      game.teams.map(async (team) => {
        await db.team.update({
          where: { id: team.id },
          data: { voiceChatRoomId: team.teamRoom!.id },
        });
      }),
    );
  } else {
    await db.team.updateMany({
      where: { gameId: game.id },
      data: { voiceChatRoomId: gameId },
    });
  }
};
