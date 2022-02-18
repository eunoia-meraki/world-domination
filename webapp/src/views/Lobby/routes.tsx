import { Route, Navigate, RouteMatch } from 'react-location';
import { loadQuery } from 'react-relay';

import GamesList_authorizedUser_Query from './GamesList/__generated__/GamesList_authorizedUser_Query.graphql';
import GamesList_games_Query from './GamesList/__generated__/GamesList_games_Query.graphql';

import type { LobbyLocation } from './LobbyLocations';

import { RelayEnvironment } from '@/RelayEnvironment';
import { Routes } from '@/enumerations';

export const LobbyRoutes: Route<LobbyLocation> = {
  path: Routes.Lobby,
  children: [
    {
      path: '/',
      element: <Navigate to="list"/>,
    },
    {
      path: 'list',
      element: () => import('./GamesList').then(({ GamesList }) => <GamesList />),
      loader: () => ({
        gamesListRef: loadQuery(RelayEnvironment, GamesList_games_Query, {}),
        userRef: loadQuery(RelayEnvironment, GamesList_authorizedUser_Query, {}, { fetchPolicy: 'network-only' }),
      }),
      onMatch: (match: RouteMatch<LobbyLocation>) => () => {
        match.data.gamesListRef?.dispose();
        match.data.userRef?.dispose();
      },
    },
    {
      path: ':gameId',
      element: () => import('./Game').then(({ Game }) => <Game/>),
      loader: ({ params: { gameId } }) => ({
        gameRef: loadQuery(RelayEnvironment, GamesList_games_Query, { gameId }),
      }),
      onMatch: (match: RouteMatch<LobbyLocation>) => () => {
        match.data.gameRef?.dispose();
      },
      children: [
        {
          path: '/',
          element: () => import('./SortingRoom')
            .then(({ SortingRoom }) => <SortingRoom />),
        },
        {
          path: 'worldstatistics',
          element: () => import('./Game/WorldStatistics')
            .then(({ WorldStatistics }) => <WorldStatistics />),
        },
        {
          path: 'countrystatistics',
          element: () => import('./Game/CountryStatistics')
            .then(({ CountryStatistics }) => <CountryStatistics />),
        },
        {
          path: 'actions',
          element: () => import('./Game/Actions')
            .then(({ Actions }) => <Actions />),
        },
        {
          path: '*',
          element: <Navigate to={Routes.Lobby}/>,
        },
      ],
    },
  ],
};
