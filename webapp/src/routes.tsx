import { Navigate } from 'react-location';

import { Routes } from './enumerations';
import { GameRoutes } from './views/Game/routes';
import { GamesRoutes } from './views/Games/routes';
import { SignInRoutes } from './views/SignIn/routes';
import { SignUpRoutes } from './views/SignUp/routes';
import { StartRoutes } from './views/Start/routes';

import type { Route } from 'react-location';

export const routes: Route[] = [
  SignInRoutes,
  SignUpRoutes,
  StartRoutes,
  GameRoutes,
  GamesRoutes,
  {
    element: <Navigate to={Routes.SignIn} />,
  },
];
