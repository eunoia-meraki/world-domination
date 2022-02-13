import { builder } from '../schemaBuilder';

const includeNodeSendBombAction = () => {
  builder.prismaNode('SendBombAction', {
    findUnique: (id) => ({ id }),
    id: { resolve: (action) => action.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      town: t.relation('town'),
      sender: t.relation('sender'),
      player: t.relation('player'),
      round: t.relation('round'),
    }),
  });
};

export default includeNodeSendBombAction;
