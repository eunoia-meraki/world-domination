import { Navigate } from 'react-location';

import { Routes } from './enumerations';
import { LobbyRoutes } from './views/Lobby/routes';
import { SignInRoutes } from './views/SignIn/routes';
import { SignUpRoutes } from './views/SignUp/routes';

import type { LobbyLocation } from './views/Lobby/LobbyLocations';
import type { Route } from 'react-location';

export type ComposedRoute = Route | Route<LobbyLocation>;

export const routes: ComposedRoute[] = [
  SignInRoutes,
  SignUpRoutes,
  LobbyRoutes,
  {
    element: <Navigate to={Routes.SignIn} />,
  },
];
