import { MakeGenerics } from 'react-location';
import { PreloadedQuery } from 'react-relay';

import type { GamesQuery as GamesQueryType } from './__generated__/GamesQuery.graphql';

export type GamesLocation = MakeGenerics<{
  LoaderData: {
    gamesRef: PreloadedQuery<GamesQueryType>;
  };
}>;
