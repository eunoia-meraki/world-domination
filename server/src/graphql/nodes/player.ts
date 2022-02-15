import { RoleType } from '@prisma/client';
import { builder } from '../schemaBuilder';

const includeNodePlayer = () => {
  builder.prismaNode('Player', {
    findUnique: (id) => ({ id }),
    id: { resolve: (user) => user.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      users: t.relation('user'),
      roles: t.expose('role', { type: RoleType }),
    }),
  });
};

export default includeNodePlayer;
