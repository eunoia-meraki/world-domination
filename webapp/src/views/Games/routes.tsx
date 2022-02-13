import { loadQuery } from 'react-relay';

import IGamesQuery from './__generated__/Games_Query.graphql';

import type { GamesLocation } from './GamesLocation';
import type { Route } from 'react-location';

import { RelayEnvironment } from '@/RelayEnvironment';
import { Routes } from '@/enumerations';

export const GamesRoutes: Route<GamesLocation> = {
  path: Routes.Games,
  element: () => import('@/views/Games')
    .then(({ Games }) => <Games />),
  loader: () => ({
    gamesRef: loadQuery(
      RelayEnvironment,
      IGamesQuery,
      {},
    ),
  }),
};
