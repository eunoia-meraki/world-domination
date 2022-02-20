import { Route, Navigate, RouteMatch } from 'react-location';
import { loadQuery } from 'react-relay';

import Game_game_Query from './Game/__generated__/Game_game_Query.graphql';
import Lobby_authorizedUser_Query from './__generated__/Lobby_authorizedUser_Query.graphql';

import type { LobbyLocation } from './LobbyLocations';

import { RelayEnvironment } from '@/RelayEnvironment';
import { Routes } from '@/enumerations';

export const LobbyRoutes: Route<LobbyLocation> = {
  path: Routes.Lobby,
  element: () => import('./Lobby').then(({ Lobby }) => <Lobby />),
  loader: () => ({
    authorizedUserRef: loadQuery(RelayEnvironment, Lobby_authorizedUser_Query, {}, { fetchPolicy: 'network-only' }),
  }),
  onMatch: (match: RouteMatch<LobbyLocation>) => () => {
    match.data.authorizedUserRef?.dispose();
  },
  children: [
    {
      path: '/',
      element: <Navigate to={Routes.Lobby}/>,
    },
    {
      path: ':gameId',
      element: () => import('./Game').then(({ Game }) => <Game />),
      loader: ({ params: { gameId } }) => ({
        gameRef: loadQuery(RelayEnvironment, Game_game_Query, { gameId }),
      }),
      onMatch: (match: RouteMatch<LobbyLocation>) => () => {
        match.data.gameRef?.dispose();
      },
      children: [
        {
          path: '/',
          // errorElement: <Navigate to={Routes.Lobby}/>,
        },
        {
          path: '*',
          element: <Navigate to={Routes.Lobby}/>,
        },
      ],
    },
  ],
};
