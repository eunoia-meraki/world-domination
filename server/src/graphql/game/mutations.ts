import { db } from '../../database/db';

import {
  GameActionType,
  GameStatus,
  Nation,
  RoleType,
  User,
} from '@prisma/client';

import { builder } from '../schemaBuilder';

import {
  CREATE_BOMB_PRICE,
  CREATE_SHIELD_PRICE,
  DEVELOP_NUCLEAR_TECHNOLOGY_PRICE,
  IMPLEMENT_ENVIROMENTAL_PROGRAM_PRICE,
  INVEST_TOWN_PRICE,
  MAX_BOMB_COUNT,
  ROUNDS_AMOUNT,
  STAGES_PER_ROUND,
  STAGE_LIFETIME,
  START_ECOLOGY,
  START_MONEY,
  TEAM_MAX_PLAYERS,
} from '../constants';
import { broadcastGame } from './subscriptions';

interface iSendActionsInput {
  investTownsIds: string[];
  shieldTownsIds: string[];
  implementEnvironmentalProgram: boolean;
  developNuclearTechnologyAction: boolean;
  sendBombsTownsIds: string[];
  sanctionsTeamIds: string[];
  createBombsCount: number;
}

const includeGameMutations = () => {
  builder.mutationField('createGame', (t) =>
    t.prismaField({
      authScopes: {
        public: true,
      },
      type: 'Game',
      args: {
        gameName: t.arg.string({ required: true }),
      },
      resolve: async (_, __, args, context) => {
        const user = context.user;

        return await db.game.create({
          data: {
            name: args.gameName,
            status: GameStatus.NOT_STARTED,
            owner: {
              connect: {
                id: user?.id,
              },
            },
            teams: {
              create: [
                {
                  nation: Nation.RUSSIA,
                  maxBombCount: MAX_BOMB_COUNT,
                  money: START_MONEY,
                  maxPlayersCount: TEAM_MAX_PLAYERS,
                },
                {
                  nation: Nation.CHINA,
                  maxBombCount: MAX_BOMB_COUNT,
                  money: START_MONEY,
                  maxPlayersCount: TEAM_MAX_PLAYERS,
                },
                {
                  nation: Nation.USA,
                  maxBombCount: MAX_BOMB_COUNT,
                  money: START_MONEY,
                  maxPlayersCount: TEAM_MAX_PLAYERS,
                },
              ],
            },
            currentRound: 1,
            ecologyValue: START_ECOLOGY,
            rounds: {
              create: Array(ROUNDS_AMOUNT)
                .fill(0)
                .map((_, idx) => ({
                  order: idx,
                  currentStage: 0,
                  stages: {
                    create: Array(STAGES_PER_ROUND)
                      .fill(0)
                      .map((_, idx) => ({
                        order: idx,
                        livetime: STAGE_LIFETIME,
                      })),
                  },
                })),
            },
          },
        });
      },
    }),
  );

  builder.mutationField('joinGame', (t) =>
    t.prismaField({
      authScopes: {
        public: true,
      },
      type: 'User',
      args: {
        gameId: t.arg.globalID({ required: true }),
      },
      resolve: async (_, __, { gameId }, context) => {
        const user = context.user as User;

        const game = await db.game.findUnique({
          where: { id: gameId.id },
          include: { teams: { include: { players: true } } },
        });

        if (!game) {
          throw new Error('Игра не найдена');
        }

        const player = await db.player.findFirst({
          where: { userId: user.id, team: { gameId: game.id } },
        });

        if (player) {
          throw new Error('Игрок уже существует');
        }

        for (const team of game.teams) {
          const players = team.players;

          if (
            players.filter((player) => player.role == RoleType.PRESIDENT)
              .length == 0
          ) {
            await db.player.create({
              data: {
                userId: user.id,
                teamId: team.id,
                role: RoleType.PRESIDENT,
              },
            });

            break;
          }

          if (
            players.filter((player) => player.role == RoleType.DIPLOMAT)
              .length == 0
          ) {
            await db.player.create({
              data: {
                userId: user.id,
                teamId: team.id,
                role: RoleType.DIPLOMAT,
              },
            });

            break;
          }
        }

        const curPlayer = await db.player.findFirst({
          where: { userId: user.id, team: { gameId: game.id } },
        });

        if (!curPlayer) {
          throw new Error('Игра переполнена');
        }

        const updatedUser = await db.user.update({
          where: { id: user.id },
          include: { currentGame: { include: { teams: true } } },
          data: {
            currentGameId: game.id,
          },
        });

        if (!updatedUser.currentGame) {
          throw new Error('Игра не найдена');
        }

        broadcastGame(context, updatedUser.currentGame);

        return updatedUser;
      },
    }),
  );

  builder.mutationField('leaveGame', (t) =>
    t.prismaField({
      authScopes: {
        public: true,
      },
      type: 'User',
      resolve: async (_, __, ___, ctx) => {
        const user = ctx.user as User;

        const game = await db.game.findUnique({
          where: { id: user.currentGameId || undefined },
        });

        if (!game) {
          throw new Error('Текущая игра не найдена');
        }

        const curPlayer = await db.player.findFirst({
          where: { userId: user.id, team: { gameId: game.id } },
        });

        await db.player.delete({ where: { id: curPlayer!.id } });

        const updatedUser = await db.user.update({
          where: { id: user.id },
          data: { currentGameId: null },
        });

        broadcastGame(ctx, game);

        return updatedUser;
      },
    }),
  );

  const SendActionsInputGqlType = builder.inputType('SendActionsInput', {
    fields: (t) => ({
      gameId: t.string({ required: true }),
      teamId: t.string({ required: true }),
      investTownsIds: t.stringList({ required: true }),
      shieldTownsIds: t.stringList({ required: true }),
      implementEnvironmentalProgram: t.boolean({ required: true }),
      developNuclearTechnologyAction: t.boolean({ required: true }),
      createBombsCount: t.int({ required: true }),
      sendBombsTownsIds: t.stringList({ required: true }),
      sanctionsTeamIds: t.stringList({ required: true }),
    }),
  });

  builder.mutationField('sendActions', (t) =>
    t.boolean({
      authScopes: {
        public: true,
      },
      args: {
        input: t.arg({
          type: SendActionsInputGqlType,
          required: true,
        }),
      },
      resolve: async (_, args, context) => {
        const user = context.user!;

        const curPlayer = await db.player.findFirst({
          where: {
            user: {
              id: user.id,
            },
          },
          include: {
            user: true,
            team: true,
          },
        });

        const curTeam = curPlayer?.team;

        if (!curPlayer || curPlayer.role != RoleType.PRESIDENT) {
          throw new Error('Игрок не является президентом.');
        }

        if (!curTeam) {
          throw new Error('Комманда игрока не найдена.');
        }

        const curGame = await db.game.findFirst({
          where: { id: curTeam.gameId },
          include: { rounds: true },
        });

        if (!curGame) {
          throw new Error('Текущая игра не найдена');
        }

        const curRound = await db.round.findFirst({
          where: { order: curGame.currentRound },
        });

        if (!curRound) {
          throw new Error('Текущая раунд не найдена');
        }

        const money = curTeam.money;

        const calculatePrice = (input: iSendActionsInput) => {
          let sum = 0;
          sum += input.investTownsIds.length * INVEST_TOWN_PRICE;
          sum += input.shieldTownsIds.length * CREATE_SHIELD_PRICE;

          if (input.developNuclearTechnologyAction) {
            sum += DEVELOP_NUCLEAR_TECHNOLOGY_PRICE;
          }

          if (input.implementEnvironmentalProgram) {
            sum += IMPLEMENT_ENVIROMENTAL_PROGRAM_PRICE;
          }

          sum += input.sendBombsTownsIds.length * CREATE_BOMB_PRICE;

          return sum;
        };

        const price = calculatePrice(args.input);

        if (price < money) {
          throw new Error('Недостаточно денег.');
        }

        // validation --
        args.input.investTownsIds.forEach((townId) => {
          const town = db.town.findFirst({
            where: { teamId: curPlayer.teamId, id: townId },
          });
          // TODO only team owner town?

          if (!town) {
            throw new Error('Город для улучшения не найден.');
          }
        });

        args.input.shieldTownsIds.forEach((townId) => {
          const town = db.town.findFirst({
            where: { teamId: curPlayer.teamId, id: townId },
          });
          // TODO only team owner town?

          if (!town) {
            throw new Error('Город для установки щита не найден.');
          }
        });

        if (
          args.input.developNuclearTechnologyAction &&
          curTeam.hasNuclearTechnology
        ) {
          throw new Error('Ядерная технология уже развита');
        }

        if (args.input.createBombsCount > 3) {
          throw new Error('Вы не можете произвести более 3х бомб');
        }

        if (
          args.input.sendBombsTownsIds.length !=
          args.input.sendBombsTownsIds.filter((v, i, a) => a.indexOf(v) === i)
            .length
        )
          throw new Error(
            'Вы можете нанести только один удар по одному городу',
          );

        args.input.investTownsIds.forEach((townId) => {
          db.gameAction.create({
            data: {
              type: GameActionType.INVEST_TOWN,
              investTownAction: {
                create: {
                  townId: townId,
                },
              },
              roundId: curRound.id,
              teamId: curTeam.id,
            },
          });
        });
        // validation !

        args.input.shieldTownsIds.forEach((townId) => {
          db.gameAction.create({
            data: {
              type: GameActionType.SHILED_CREATION,
              shieldCreationAction: {
                create: {
                  townId: townId,
                },
              },
              roundId: curRound.id,
              teamId: curTeam.id,
            },
          });
        });

        if (args.input.implementEnvironmentalProgram) {
          db.gameAction.create({
            data: {
              type: GameActionType.ECOLOGY_DEPOSIT,
              ecologyDepositAction: {
                create: {},
              },
              roundId: curRound.id,
              teamId: curTeam.id,
            },
          });
        }

        if (args.input.developNuclearTechnologyAction) {
          db.gameAction.create({
            data: {
              type: GameActionType.DEVELOP_NUCLEAR_TECHNOLOGY,
              developNuclearTechnologyAction: {
                create: {},
              },
              roundId: curRound.id,
              teamId: curTeam.id,
            },
          });
        }

        if (args.input.createBombsCount > 0) {
          db.gameAction.create({
            data: {
              type: GameActionType.CREATE_BOMB,
              createBombAction: {
                create: {
                  count: args.input.createBombsCount,
                  creatorId: curTeam.id,
                },
              },
              roundId: curRound.id,
              teamId: curTeam.id,
            },
          });
        }

        args.input.sendBombsTownsIds.forEach((townId) => {
          db.gameAction.create({
            data: {
              type: GameActionType.SEND_BOMB,
              sendBombAction: {
                create: {
                  townId,
                  senderId: curTeam.id,
                },
              },
              roundId: curRound.id,
              teamId: curTeam.id,
            },
          });
        });

        args.input.sanctionsTeamIds.forEach((teamId) => {
          db.gameAction.create({
            data: {
              type: GameActionType.SANCTION,
              sanctionAction: {
                create: {
                  victimId: teamId,
                },
              },
              roundId: curRound.id,
              teamId: curTeam.id,
            },
          });
        });

        return true;
      },
    }),
  );
};

export default includeGameMutations;
