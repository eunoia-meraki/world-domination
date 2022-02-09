import { Actions } from './Content/Actions';
import { CountryStatistics } from './Content/CountryStatistics';
import { Main } from './Content/Main';
import { WorldStatistics } from './Content/WorldStatistics';
import { Game } from './Game';

import type { Route } from 'react-location';

import { Routes } from '@/enumerations';

export const GameRoutes: Route = {
  path: Routes.Game,
  element: <Game />,
  children: [
    {
      path: '/',
      element: <Main />,
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
