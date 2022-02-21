import * as bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server';
import { generateJwtToken } from '../auth';
import { db } from '../database/db';
import { builder } from './schemaBuilder';
import { User } from '@prisma/client';

const includeAuthMutations = () => {
  class AuthorizationPayload {
    token: string;
    user: User;

    constructor(token: string, user: User) {
      this.token = token;
      this.user = user;
    }
  }

  const AuthorizationPayloadGqlType = builder.objectType(AuthorizationPayload, {
    name: 'AuthorizationPayload',
    fields: (t) => ({
      token: t.field({
        type: 'String',
        resolve: (payload) => {
          return payload.token;
        },
      }),
      user: t.prismaField({
        type: 'User',
        resolve: (_, payload) => {
          return payload.user;
        },
      }),
    }),
  });

  builder.mutationField('signUp', (t) =>
    t.field({
      type: AuthorizationPayloadGqlType,
      args: {
        login: t.arg.string({ required: true }),
        password: t.arg.string({ required: true }),
      },
      resolve: async (_, { login, password }, ctx) => {
        const candidate = await db.user.findUnique({
          where: { login: login },
        });

        if (candidate) {
          throw new AuthenticationError(
            'Пользователь с таким login уже существует',
          );
        }

        const hashPassword = await bcrypt.hash(
          password,
          process.env.JWT_SECRET?.length || 5,
        );
        const user = await db.user.create({
          data: {
            login: login,
            passwordHash: hashPassword,
          },
        });

        // need to allow query 'user' field
        ctx.user = user;

        return {
          token: generateJwtToken(user),
          user: user,
        };
      },
    }),
  );

  builder.mutationField('signIn', (t) =>
    t.field({
      type: AuthorizationPayloadGqlType,
      args: {
        login: t.arg.string({ required: true }),
        password: t.arg.string({ required: true }),
      },
      resolve: async (_, { login, password }, ctx) => {
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

        // need to allow query 'user' field
        ctx.user = user;

        return {
          token: generateJwtToken(user),
          user: user,
        };
      },
    }),
  );
};

export default includeAuthMutations;
