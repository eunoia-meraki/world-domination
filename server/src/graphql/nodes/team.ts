import { Nation } from '@prisma/client';
import { WDSchemaBuilder } from '../schemaBuilder';

const includeNodeTeam = (builder: WDSchemaBuilder) => {
  builder.prismaNode('Team', {
    findUnique: (id) => ({ id }),
    id: { resolve: (team) => team.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      players: t.relation('players'),
      nation: t.expose('nation', { type: Nation }),
      money: t.exposeInt('money'),
      maxPlayersCount: t.exposeInt('maxPlayersCount'),
      maxBombCount: t.exposeInt('maxBombCount'),
      game: t.relation('game'),
      teamRoom: t.relation('teamRoom'),
      sendBombActions: t.relation('sendBombActions'),
      createBombActions: t.relation('createBombActions'),
      sendDiplomatActions: t.relation('sendDiplomatActions'),
      destinationDiplomatActions: t.relation('destinationDiplomatActions'),
    }),
  });
};

export default includeNodeTeam;
