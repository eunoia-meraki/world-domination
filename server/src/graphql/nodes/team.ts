import { Nation } from '@prisma/client';
import { builder } from '../schemaBuilder';

const includeNodeTeam = () => {
  builder.prismaNode('Team', {
    findUnique: (id) => ({ id }),
    id: { resolve: (team) => team.id },
    authScopes: {
      public: true,
    },
    fields: (t) => ({
      players: t.relation('players'),
      nation: t.expose('nation', { type: Nation }),
      hasNuclearTechnology: t.exposeBoolean('hasNuclearTechnology'),
      money: t.exposeInt('money'),
      maxPlayersCount: t.exposeInt('maxPlayersCount'),
      maxBombCount: t.exposeInt('maxBombCount'),
      game: t.relation('game'),
      teamRoom: t.relation('teamRoom'),
      towns: t.relation('towns'),
      sendBombActions: t.relation('sendBombActions'),
      createBombActions: t.relation('createBombActions'),
      sanctionsActions: t.relation('sanctionActions'),
      actions: t.relation('actions'),
    }),
  });
};

export default includeNodeTeam;
