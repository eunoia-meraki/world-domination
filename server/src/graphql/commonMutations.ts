import * as bcrypt from 'bcryptjs';
import { AuthenticationError } from 'apollo-server';
import { generateJwtToken } from '../auth';
import { db } from '../database/db';
import { GameStatus, Nation } from '@prisma/client';
import { builder } from './schemaBuilder';

const includeCommonMutations = () => {
  class SignInPayload {
    id: string;
    token: string;

    constructor(id: string, token: string) {
      this.id = id;
      this.token = token;
    }
  }

  class SignUpPayload extends SignInPayload {}

  const SignInPayloadGqlType = builder.objectType(SignInPayload, {
    name: 'SignInPayload',
    fields: (t) => ({
      id: t.field({
        type: 'String',
        resolve: (payload) => {
          return payload.id;
        },
      }),
      token: t.field({
        type: 'String',
        resolve: (payload) => {
          return payload.token;
        },
      }),
    }),
  });

  const SignUpPayloadGqlType = builder.objectType(SignUpPayload, {
    name: 'SignUpPayload',
    fields: (t) => ({
      id: t.field({
        type: 'String',
        resolve: (payload) => {
          return payload.id;
        },
      }),
      token: t.field({
        type: 'String',
        resolve: (payload) => {
          return payload.token;
        },
      }),
    }),
  });

  builder.mutationField('signUp', (t) =>
    t.field({
      type: SignUpPayloadGqlType,
      args: {
        login: t.arg.string({ required: true }),
        password: t.arg.string({ required: true }),
      },
      resolve: async (_, { login, password }) => {
        const candidate = await db.user.findUnique({
          where: { login: login },
        });

        if (candidate) {
          throw new AuthenticationError(
            'Пользователь с таким login уже существует',
          );
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await db.user.create({
          data: {
            login: login,
            passwordHash: hashPassword,
          },
        });

        return { id: user.id, token: generateJwtToken(user) };
      },
    }),
  );

  builder.mutationField('signIn', (t) =>
    t.field({
      type: SignInPayloadGqlType,
      args: {
        login: t.arg.string({ required: true }),
        password: t.arg.string({ required: true }),
      },
      resolve: async (_, { login, password }) => {
        const user = await db.user.findUnique({
          where: { login: login },
        });
        const passwordEquals = await bcrypt.compare(
          password,
          user?.passwordHash || '',
        );

        if (!user || !passwordEquals) {
          throw new AuthenticationError('Неверный логин или пароль');
        }

        return { id: user.id, token: generateJwtToken(user) };
      },
    }),
  );

  builder.mutationField('createGame', (t) =>
    t.prismaField({
      authScopes: {
        public: true,
      },
      type: 'Game',
      args: {
        gameName: t.arg.string({ required: true }),
        // gameStatus: t.arg({
        //   type: GameStatus,
        // }),
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
};

export default includeCommonMutations;
