import { Actions } from './Actions';
import { ConferenceHall } from './ConferenceHall';
import { CountryStatistics } from './CountryStatistics';
import { Game } from './Game';
import { WorldStatistics } from './WorldStatistics';

import type { Route } from 'react-location';

import { Routes } from '@/enumerations';

export const GameRoutes: Route = {
  path: `${Routes.Game}/:gameId`,
  element: <Game />,
  children: [
    {
      path: '/',
      element: <ConferenceHall />,
    },
    {
      path: 'worldstatistics',
      element: <WorldStatistics />,
    },
    {
      path: 'countrystatistics',
      element: <CountryStatistics />,
    },
    {
      path: 'actions',
      element: <Actions />,
    },
  ],
};
