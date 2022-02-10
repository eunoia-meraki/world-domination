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
      economicDepositActions: t.relation('economicDepositActions'),
      shieldCreationActionActions: t.relation('shieldCreationActionActions'),
      sendBombActions: t.relation('sendBombActions'),
      createBombActions: t.relation('createBombActions'),
      sendDiplomatActions: t.relation('sendDiplomatActions'),
    }),
  });
};

export default includeNodePlayer;
