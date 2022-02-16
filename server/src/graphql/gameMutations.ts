import { db } from '../database/db';
import { GameStatus, Nation, RoleType } from '@prisma/client';
import { builder } from './schemaBuilder';
import {
  CREATE_BOMB_PRICE,
  CREATE_SHIELD_PRICE,
  DEVELOP_NUCLEAR_TECHNOLOGY_PRICE,
  IMPLEMENT_ENVIROMENTAL_PROGRAM_PRICE,
  INVEST_CITY_PRICE,
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
        const user = await context.user;

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
                  maxBombCount: 2,
                  money: 100,
                  maxPlayersCount: 5,
                },
                {
                  nation: Nation.UKRAINE,
                  maxBombCount: 2,
                  money: 100,
                  maxPlayersCount: 5,
                },
                {
                  nation: Nation.USA,
                  maxBombCount: 2,
                  money: 100,
                  maxPlayersCount: 5,
                },
                {
                  nation: Nation.CHINA,
                  maxBombCount: 2,
                  money: 100,
                  maxPlayersCount: 5,
                },
              ],
            },
            currentRound: 1,
            ecologyValue: 10,
            rounds: {
              create: [
                {
                  currentStage: 0,
                  order: 0,
                  stages: {
                    create: [
                      {
                        order: 0,
                        livetime: 60,
                      },
                      {
                        order: 1,
                        livetime: 60,
                      },
                    ],
                  },
                },
                {
                  currentStage: 0,
                  order: 1,
                  stages: {
                    create: [
                      {
                        order: 0,
                        livetime: 60,
                      },
                      {
                        order: 1,
                        livetime: 60,
                      },
                    ],
                  },
                },
              ],
            },
          },
        });
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
