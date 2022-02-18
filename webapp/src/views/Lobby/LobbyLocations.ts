import type { Game_game_Query as GameGameQueryType } from './Game/__generated__/Game_game_Query.graphql';
import type { Lobby_authorizedUser_Query as LobbyAuthorizedUserQueryType } from './__generated__/Lobby_authorizedUser_Query.graphql';
import type { MakeGenerics } from 'react-location';
import type { PreloadedQuery } from 'react-relay';

export type LobbyLocation = MakeGenerics<{
  LoaderData: {
    authorizedUserRef: PreloadedQuery<LobbyAuthorizedUserQueryType>;
    gameRef: PreloadedQuery<GameGameQueryType>;
  };
  Params: {
    gameId: string;
  };
}>;
