import { Game } from './Game';

import type { Route } from 'react-location';

import { Routes } from '@/enumerations';

export const GameRoutes: Route = {
  path: Routes.Game,
  element: <Game />,
};
