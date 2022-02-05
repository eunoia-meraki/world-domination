import { builder } from './schema_builder';
import { db } from '../database/db';
import * as bcrypt from 'bcryptjs';
import { generateJwtToken } from '../auth';
import { AuthenticationError } from 'apollo-server';

builder.prismaNode('User', {
  findUnique: (id) => ({ id }),
  id: { resolve: (user) => user.id },
  fields: (t) => ({
    login: t.exposeString('login'),
    passwordHash: t.exposeString('passwordHash'),
    players: t.relation('players'),
  }),
});

builder.prismaNode('Player', {
  findUnique: (id) => ({ id }),
  id: { resolve: (user) => user.id },
  fields: (t) => ({
    users: t.relation('user'),
    roles: t.relation('role'),
  }),
});

builder.prismaNode('Role', {
  findUnique: (id) => ({ id }),
  id: { resolve: (user) => user.id },
  fields: (t) => ({
    name: t.exposeString('name'),
    players: t.relation('players'),
  }),
});

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
  }),
});

builder.mutationType({
  fields: (t) => ({
    signUp: t.string({
      args: {
        login: t.arg.string({ required: true }),
        password: t.arg.string({ required: true }),
      },
      resolve: async (query, args) => {
        const candidate = await db.user.findUnique({
          where: { login: args.login },
        });

        if (candidate) {
          throw new AuthenticationError(
            'Пользователь с таким login уже существует',
          );
        }

        const hashPassword = await bcrypt.hash(args.password, 5);
        const user = await db.user.create({
          data: {
            login: args.login,
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
      resolve: async (query, args) => {
        const user = await db.user.findUnique({
          where: { login: args.login },
        });
        const passwordEquals = await bcrypt.compare(
          args.password,
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

// builder.prismaNode('Post', {
//   findUnique: (id) => ({ id: Number.parseInt(id, 10) }),
//   id: { resolve: (post) => post.id },
//   fields: (t) => ({
//     title: t.exposeString('title'),
//     content: t.exposeString('content'),
//     author: t.relation('author'),
//     comments: t.relation('comments'),
//   }),
// });

// builder.prismaNode('Comment', {
//   findUnique: (id) => ({ id: Number.parseInt(id, 10) }),
//   id: { resolve: (post) => post.id },
//   fields: (t) => ({
//     comment: t.exposeString('comment'),
//     author: t.relation('author'),
//     post: t.relation('post'),
//   }),
// });

// builder.queryType({
//   fields: (t) => ({
//     post: t.prismaField({
//       type: 'Post',
//       nullable: true,
//       args: {
//         id: t.arg.id({ required: true }),
//       },
//       resolve: (query, root, args) =>
//         db.post.findUnique({
//           ...query,
//           where: { id: Number.parseInt(String(args.id), 10) },
//         }),
//     }),
//     posts: t.prismaConnection({
//       type: 'Post',
//       cursor: 'id',
//       resolve: (query) =>
//         db.post.findMany({
//           ...query,
//         }),
//     }),
//     user: t.prismaField({
//       type: 'User',
//       nullable: true,
//       args: {
//         id: t.arg.id({ required: true }),
//       },
//       resolve: (query, root, args) =>
//         db.user.findUnique({
//           ...query,
//           where: { id: Number.parseInt(String(args.id), 10) },
//         }),
//     }),
//   }),
// });

export const schema = builder.toSchema({});
