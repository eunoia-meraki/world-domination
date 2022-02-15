import type { LobbyLocation } from './LobbyLocation';
import type { Route } from 'react-location';

import { Routes } from '@/enumerations';

export const LobbyRoutes: Route<LobbyLocation> = {
  path: `${Routes.Lobby}/:lobbyId`,
  element: () => import('@/views/Lobby')
    .then(({ Lobby }) => <Lobby />),
};
