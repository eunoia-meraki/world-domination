import type { Route } from 'react-location';

import { Routes } from '../../enumerations';

import { Game } from '../../views/Game';

export const GameRoutes: Route = {
  path: Routes.Game,
  element: <Game />,
};
