import { Navigate } from 'react-location';

import type { Route } from 'react-location';

import { Routes } from './enumerations';

import { SignInRoutes } from './views/SignIn/routes';
import { SignUpRoutes } from './views/SignUp/routes';
import { StartRoutes } from './views/Start/routes';
import { GameRoutes } from './views/Game/routes';

export const routes: Route[] = [
  SignInRoutes,
  SignUpRoutes,
  StartRoutes,
  GameRoutes,
  {
    element: <Navigate to={Routes.SignIn} />,
  },
];
