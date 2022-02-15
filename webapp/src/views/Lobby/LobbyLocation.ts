import type { MakeGenerics } from 'react-location';

export type LobbyLocation = MakeGenerics<{
  Params: {
    lobbyId: string;
  };
}>;
