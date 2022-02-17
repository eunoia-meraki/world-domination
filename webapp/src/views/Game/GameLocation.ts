import type { Game_game_Query } from './__generated__/Game_game_Query.graphql';
import type { MakeGenerics } from 'react-location';
import type { PreloadedQuery } from 'react-relay';

export type GameLocation = MakeGenerics<{
  Params: {
    gameId: string;
  };
  LoaderData: {
    gameRef: PreloadedQuery<Game_game_Query>;
  };
}>;
