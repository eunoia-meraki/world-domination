import { Navigate } from 'react-location';

import { Routes } from './enumerations';
import { GameRoutes } from './views/Game/routes';
import { LobbiesRoutes } from './views/Lobbies/routes';
import { LobbyRoutes } from './views/Lobby/routes';
import { SignInRoutes } from './views/SignIn/routes';
import { SignUpRoutes } from './views/SignUp/routes';

import type { GameLocation } from './views/Game/GameLocation';
import type { LobbiesLocation } from './views/Lobbies/LobbiesLocation';
import type { LobbyLocation } from './views/Lobby/LobbyLocation';
import type { Route } from 'react-location';

export type ComposedRoute = Route | Route<LobbiesLocation> | Route<LobbyLocation> | Route<GameLocation>;

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
