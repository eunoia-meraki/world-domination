import * as bcrypt from 'bcryptjs';
import { AuthenticationError } from 'apollo-server';
import { generateJwtToken } from '../auth';
import { db } from '../database/db';
import { builder } from './schemaBuilder';
import { Game } from '@prisma/client';

const includeAuthMutations = () => {
  class SignInPayload {
    id: string;
    token: string;
    currentGame: Game | null;

    constructor(id: string, token: string, currentGame: Game | null) {
      this.id = id;
      this.token = token;
      this.currentGame = currentGame;
    }
  }

  class SignUpPayload extends SignInPayload {}

  const SignInPayloadGqlType = builder.objectType(SignInPayload, {
    name: 'SignInPayload',
    fields: (t) => ({
      id: t.globalID({
        resolve: (payload) => {
          return { type: 'User', id: payload.id };
        },
      }),
      token: t.field({
        type: 'String',
        resolve: (payload) => {
          return payload.token;
        },
      }),
      currentGame: t.prismaField({
        type: 'Game',
        nullable: true,
        resolve: (_, payload) => {
          return payload.currentGame;
        },
      }),
    }),
  });

  const SignUpPayloadGqlType = builder.objectType(SignUpPayload, {
    name: 'SignUpPayload',
    fields: (t) => ({
      id: t.globalID({
        resolve: (payload) => {
          return { type: 'User', id: payload.id };
        },
      }),
      token: t.field({
        type: 'String',
        resolve: (payload) => {
          return payload.token;
        },
      }),
      currentGame: t.prismaField({
        type: 'Game',
        nullable: true,
        resolve: (payload) => {
          return (payload?.include || null) as Game | null;
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

        return {
          id: user.id,
          token: generateJwtToken(user),
          currentGame: null,
        };
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
          include: { currentGame: true },
        });
        const passwordEquals = await bcrypt.compare(
          password,
          user?.passwordHash || '',
        );

        if (!user || !passwordEquals) {
          throw new AuthenticationError('Неверный логин или пароль');
        }

        return {
          id: user.id,
          token: generateJwtToken(user),
          currentGame: user.currentGame,
        };
      },
    }),
  );
};

export default includeAuthMutations;
