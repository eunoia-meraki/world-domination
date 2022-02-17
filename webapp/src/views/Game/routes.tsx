import { Navigate, Route } from 'react-location';

import type { GameLocation } from './GameLocation';

import { Routes } from '@/enumerations';

export const GameRoutes: Route<GameLocation> = {
  path: Routes.Game,
  children: [
    {
      path: '/',
      element: <Navigate to={sessionStorage.getItem('currentGameId')}/>,
    },
    {
      path: ':gameId',
      element: () => import('./Game').then(({ Game }) => <Game />),
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
