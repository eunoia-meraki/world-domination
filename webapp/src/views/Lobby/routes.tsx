import { loadQuery } from 'react-relay';

import GamesList_games_Query from './GamesList/__generated__/GamesList_games_Query.graphql';
import { Lobby } from './Lobby';

import type { GamesList_games_Query as GamesListGamesQueryType } from './GamesList/__generated__/GamesList_games_Query.graphql';
import type { Route, MakeGenerics } from 'react-location';
import type { PreloadedQuery } from 'react-relay';

import { RelayEnvironment } from '@/RelayEnvironment';
import { Routes } from '@/enumerations';

export type LobbyLocation = MakeGenerics<{
  LoaderData: {
    gamesListRef: PreloadedQuery<GamesListGamesQueryType>;
  };
  Params: {
    gameId: string;
  };
}>;

export const LobbyRoutes: Route<LobbyLocation> = {
  path: Routes.Lobby,
  element: <Lobby />,
  children: [
    {
      path: '/',
      element: () => import('./GamesList').then(({ GamesList }) => <GamesList />),
      loader: () => ({
        gamesListRef: loadQuery(RelayEnvironment, GamesList_games_Query, {}),
      }),
    },
    {
      path: ':gameId',
      element: () => import('./SortingRoom').then(({ SortingRoom }) => <SortingRoom />),
    },
  ],
};
