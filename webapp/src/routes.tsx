import { Navigate } from 'react-location';

import { Routes } from './enumerations';
import { GameRoutes } from './views/Game/routes';
import { LobbiesRoutes } from './views/Lobbies/routes';
import { SignInRoutes } from './views/SignIn/routes';
import { SignUpRoutes } from './views/SignUp/routes';

import type { LobbiesLocation } from './views/Lobbies/LobbiesLocation';
import type { Route } from 'react-location';
import type { LobbyLocation } from './views/Lobby/LobbyLocation';
import { LobbyRoutes } from './views/Lobby/routes';

export type ComposedRoute = Route | Route<LobbiesLocation> | Route<LobbyLocation>;

export const routes: ComposedRoute[] = [
  SignInRoutes,
  SignUpRoutes,
  GameRoutes,
  LobbiesRoutes,
  LobbyRoutes,
  {
    element: <Navigate to={Routes.SignIn} />,
  },
];
