import { Navigate } from 'react-location';

import { Routes } from './enumerations';
import { GameRoutes } from './views/Game/routes';
import { LobbyRoutes } from './views/Lobby/routes';
import { SignInRoutes } from './views/SignIn/routes';
import { SignUpRoutes } from './views/SignUp/routes';

import type { GameLocation } from './views/Game/GameLocation';
import type { LobbyLocation } from './views/Lobby/routes';
import type { Route } from 'react-location';

export type ComposedRoute = Route | Route<LobbyLocation> | Route<GameLocation>;

export const routes: ComposedRoute[] = [
  SignInRoutes,
  SignUpRoutes,
  GameRoutes,
  LobbyRoutes,
  {
    element: <Navigate to={Routes.SignIn} />,
  },
];
