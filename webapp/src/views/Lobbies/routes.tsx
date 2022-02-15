import { loadQuery } from 'react-relay';

import IGamesQuery from './__generated__/Lobbies_games_Query.graphql';

import type { LobbiesLocation } from './LobbiesLocation';
import type { Route } from 'react-location';

import { RelayEnvironment } from '@/RelayEnvironment';
import { Routes } from '@/enumerations';

export const LobbiesRoutes: Route<LobbiesLocation> = {
  path: Routes.Lobbies,
  element: () => import('@/views/Lobbies')
    .then(({ Lobbies }) => <Lobbies />),
  loader: () => ({
    gamesRef: loadQuery(
      RelayEnvironment,
      IGamesQuery,
      {},
    ),
  }),
  children: [
    {
      path: ':lobbyId',
      element: () => import('@/views/Lobby')
        .then(({ Lobby }) => <Lobby />),
    },
  ],
};
