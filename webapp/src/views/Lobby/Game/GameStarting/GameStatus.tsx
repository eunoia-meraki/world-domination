import { CircularProgress, Container } from '@mui/material';
import graphql from 'babel-plugin-relay/macro';
import { useFragment } from 'react-relay';

import type { FC } from 'react';

import type { GameStatus_game_Fragment$key } from './__generated__/GameStatus_game_Fragment.graphql';

interface IGameStarting {
  game: GameStatus_game_Fragment$key;
}

export const GameStatus: FC<IGameStarting> = ({ game }) => {
  const data = useFragment(
    graphql`
      fragment GameStatus_game_Fragment on Game {
        status
      }
    `,
    game,
  );

  if (data.status === 'ON_STARTING') {

    return (
      <Container sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
        <CircularProgress />
        <b>Starting game...</b>
      </Container>);
  }

  if (data.status === 'NOT_STARTED') {

    return (
      <Container sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
        <b>Waiting for the players...</b>
      </Container>);
  }

  return null;
};
