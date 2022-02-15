import type { Lobbies_games_Query as QueryType } from './__generated__/Lobbies_games_Query.graphql';
import type { MakeGenerics } from 'react-location';
import type { PreloadedQuery } from 'react-relay';

export type LobbiesLocation = MakeGenerics<{
  LoaderData: {
    gamesRef: PreloadedQuery<QueryType>;
  };
  Params: {
    lobbyId: string;
  };
}>;
