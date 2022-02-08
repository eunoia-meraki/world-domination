import { loadQuery } from 'react-relay';

import { GamesLocation } from './GamesLocation';
import IGamesQuery from './__generated__/GamesQuery.graphql';

import type { Route } from 'react-location';

import { RelayEnvironment } from '@/RelayEnvironment';
import { Routes } from '@/enumerations';

export const GamesRoutes: Route<GamesLocation> = {
  path: Routes.Games,
  element: import('@/views/Games')
    .then(({ Games }) => <Games />),
  loader: () => ({
    gamesRef: loadQuery(
      RelayEnvironment,
      IGamesQuery,
      {},
    ),
  }),
};
