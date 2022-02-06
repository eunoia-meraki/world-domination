import * as bcrypt from 'bcryptjs';
import { AuthenticationError } from 'apollo-server';
import { generateJwtToken } from '../auth';
import { db } from '../database/db';
import { WDSchemaBuilder } from './schema_builder';

const includeCommonMutations = (builder: WDSchemaBuilder) => {
  builder.mutationType({
    fields: (t) => ({
      signUp: t.string({
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

          return generateJwtToken(user);
        },
      }),
      signIn: t.string({
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

          return generateJwtToken(user);
        },
      }),
    }),
  });
};

export default includeCommonMutations;
