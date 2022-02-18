import type { Game_game_Query as GamesGameQueryType } from './Game/__generated__/Game_game_Query.graphql';
import type { GamesList_authorizedUser_Query as GamesListAuthorizedUserQueryType } from './GamesList/__generated__/GamesList_authorizedUser_Query.graphql';
import type { GamesList_games_Query as GamesListGamesQueryType } from './GamesList/__generated__/GamesList_games_Query.graphql';
import type { MakeGenerics } from 'react-location';
import type { PreloadedQuery } from 'react-relay';

export type LobbyLocation = MakeGenerics<{
  LoaderData: {
    gamesListRef: PreloadedQuery<GamesListGamesQueryType>;
    gameRef: PreloadedQuery<GamesGameQueryType>;
    userRef: PreloadedQuery<GamesListAuthorizedUserQueryType>;
  };
  Params: {
    gameId: string;
  };
}>;
