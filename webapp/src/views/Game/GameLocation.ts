import type { MakeGenerics } from 'react-location';

export type GameLocation = MakeGenerics<{
  Params: {
    gameId: string;
  };
}>;
