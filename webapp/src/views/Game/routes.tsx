import { Navigate, Route, RouteMatch } from 'react-location';
import { loadQuery } from 'react-relay';

import Game_game_Query from './__generated__/Game_game_Query.graphql';

import type { GameLocation } from './GameLocation';

import { RelayEnvironment } from '@/RelayEnvironment';
import { Routes } from '@/enumerations';

export const GameRoutes: Route<GameLocation> = {
  path: Routes.Game,
  children: [
    {
      path: '/',
      element: <Navigate to={sessionStorage.getItem('currentGameId') ?? Routes.Lobby}/>,
    },
    {
      path: ':gameId',
      element: () => import('./Game').then(({ Game }) => <Game />),
      loader: ({ params: { gameId } }) => ({
        gameRef: loadQuery(RelayEnvironment, Game_game_Query, {
          gameId,
        }),
      }),
      onMatch: (match: RouteMatch<GameLocation>) => () => {
        match.data.gameRef?.dispose();
      },
      children: [
        {
          path: '/',
          element: () => import('./ConferenceHall')
            .then(({ ConferenceHall }) => <ConferenceHall />),
        },
        {
          path: 'worldstatistics',
          element: () => import('./WorldStatistics')
            .then(({ WorldStatistics }) => <WorldStatistics />),
        },
        {
          path: 'countrystatistics',
          element: () => import('./CountryStatistics')
            .then(({ CountryStatistics }) => <CountryStatistics />),
        },
        {
          path: 'actions',
          element: () => import('./Actions')
            .then(({ Actions }) => <Actions />),
        },
        {
          path: '*',
          element: <Navigate to={Routes.Game}/>,
        },
      ],
    },
  ],
};
