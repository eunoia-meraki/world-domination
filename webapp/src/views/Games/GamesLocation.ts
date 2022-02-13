import type { Games_Query as GamesQueryType } from './__generated__/Games_Query.graphql';
import type { MakeGenerics } from 'react-location';
import type { PreloadedQuery } from 'react-relay';

export type GamesLocation = MakeGenerics<{
  LoaderData: {
    gamesRef: PreloadedQuery<GamesQueryType>;
  };
}>;
