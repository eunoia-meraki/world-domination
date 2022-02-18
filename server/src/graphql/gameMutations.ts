import { db } from '../database/db';
import { Game, GameStatus, Nation, RoleType, User } from '@prisma/client';
import { builder } from './schemaBuilder';
import {
  CREATE_BOMB_PRICE,
  CREATE_SHIELD_PRICE,
  DEVELOP_NUCLEAR_TECHNOLOGY_PRICE,
  IMPLEMENT_ENVIROMENTAL_PROGRAM_PRICE,
  INVEST_CITY_PRICE,
  MAX_BOMB_COUNT,
  ROUNDS_AMOUNT,
  STAGES_PER_ROUND,
  STAGE_LIFETIME,
  START_ECOLOGY,
  START_MONEY,
  TEAM_MAX_PLAYERS,
} from './constants';

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
        const game = await db.game.findUnique({ where: { id: gameId.id } });

        if (!game) {
          throw new Error('Игра не найнена');
        }

        const updated = await db.user.update({
          where: { id: user.id },
          include: { currentGame: true },
          data: {
            currentGameId: game.id,
          },
        });

        return updated;
      },
    }),
  );

  const SendActionsInputGqlType = builder.inputType('SendActionsInput', {
    fields: (t) => ({
      gameId: t.string({ required: true }),
      teamId: t.string({ required: true }),
      investCitiesIds: t.stringList({ required: true }),
      shieldCitiesIds: t.stringList({ required: true }),
      implementEnvironmentalProgram: t.boolean({ required: true }),
      developNuclearTechnologyAction: t.boolean({ required: true }),
      createBombsCount: t.int({ required: true }),
      sendBombsCitiesIds: t.stringList({ required: true }),
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

        interface iSendActionsInput {
          investCitiesIds: string[];
          shieldCitiesIds: string[];
          implementEnvironmentalProgram: boolean;
          developNuclearTechnologyAction: boolean;
          sendBombsCitiesIds: string[];
          sanctionsTeamIds: string[];
        }

        const money = curTeam.money;

        const calculatePrice = (input: iSendActionsInput) => {
          let sum = 0;
          sum += input.investCitiesIds.length * INVEST_CITY_PRICE;
          sum += input.shieldCitiesIds.length * CREATE_SHIELD_PRICE;

          if (input.developNuclearTechnologyAction) {
            sum += DEVELOP_NUCLEAR_TECHNOLOGY_PRICE;
          }

          if (input.implementEnvironmentalProgram) {
            sum += IMPLEMENT_ENVIROMENTAL_PROGRAM_PRICE;
          }

          sum += input.sendBombsCitiesIds.length * CREATE_BOMB_PRICE;

          return sum;
        };

        const price = calculatePrice(args.input);

        if (price < money) {
          throw new Error('Недостаточно денег.');
        }

        const validateInput = (input: iSendActionsInput) => {};

        return true;
      },
    }),
  );
};

export default includeGameMutations;
