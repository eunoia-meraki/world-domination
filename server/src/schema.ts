// import { DateResolver } from 'graphql-scalars';
import { builder } from './builder';
import { db } from './db';

builder.prismaNode('User', {
  findUnique: (id) => ({ id }),
  id: { resolve: (user) => user.id },
  fields: (t) => ({
    login: t.exposeString('login'),
    password: t.exposeString('password'),
    email: t.exposeString('email'),
    nickname: t.exposeString('nickname'),
  }),
});

builder.queryType({
  fields: (t) => ({
    users: t.prismaConnection({
      type: 'User',
      cursor: 'id',
      resolve: async (query) => {
        await db.user.create({
          data: {
            email: 'email',
            login: 'login',
            password: 'password',
            nickname: 'nickname',
          },
        });
        return db.user.findMany({
          ...query,
        });
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
