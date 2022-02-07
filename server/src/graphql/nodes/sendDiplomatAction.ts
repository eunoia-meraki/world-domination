import { WDSchemaBuilder } from '../schemaBuilder';

const includeNodeSendDiplomatAction = (builder: WDSchemaBuilder) => {
  builder.prismaNode('SendDiplomatAction', {
    findUnique: (id) => ({ id }),
    id: { resolve: (action) => action.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      sender: t.relation('sender'),
      destination: t.relation('destination'),
      player: t.relation('player'),
      round: t.relation('round'),
    }),
  });
};

export default includeNodeSendDiplomatAction;
