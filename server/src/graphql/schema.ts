import { getSchemaBuilder } from './schema_builder';
import includeNodeUser from './nodes/user';
import includeNodeRole from './nodes/role';
import includeNodePlayer from './nodes/player';
import includeCommonMutations from './common_mutations';
import { GraphQLSchema } from 'graphql';

const getGraphQLSchema = (): GraphQLSchema => {
  const builder = getSchemaBuilder();

  includeCommonMutations(builder);
  includeNodeUser(builder);
  includeNodeRole(builder);
  includeNodePlayer(builder);

  return builder.toSchema({});
};

export default getGraphQLSchema;

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
