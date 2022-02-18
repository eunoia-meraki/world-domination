import { User } from '@prisma/client';
import { db } from '../database/db';
import { builder } from './schemaBuilder';

const includeCommonQueries = () => {
  builder.queryType({
    fields: (t) => ({
      users: t.prismaConnection({
        authScopes: {
          public: true,
        },
        type: 'User',
        cursor: 'id',
        resolve: async (query) => {
          return db.user.findMany({
            ...query,
          });
        },
      }),
      games: t.prismaConnection({
        authScopes: {
          public: true,
        },
        type: 'Game',
        cursor: 'id',
        resolve: async (query) => {
          return db.game.findMany({
            ...query,
          });
        },
      }),
      authorizedUser: t.prismaField({
        authScopes: {
          public: true,
        },
        type: 'User',
        resolve: async (_, __, ___, ctx) => {
          return ctx.user as User;
        },
      }),
    }),
  });
};

export default includeCommonQueries;
