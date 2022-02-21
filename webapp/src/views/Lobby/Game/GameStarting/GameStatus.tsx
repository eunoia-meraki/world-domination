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
        id
        status
        currentRound
        rounds {
          id
          currentStage
          order
          stages {
            id
            startDate
            order
          }
        }
      }
    `,
    game,
  );

  const curRound = data.rounds.find(round => round.order === data.currentRound);
  const curStage = curRound?.stages.find(stage => stage.order === curRound?.currentStage);

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
      {data.status === 'ON_STARTING' && (
        <>
          <CircularProgress />
          <b>Starting game...</b>
        </>
      )}
      {data.status === 'NOT_STARTED' && (
        <b>Waiting for the players...</b>
      )}
      {data.status === 'ON_GOING' && curRound && (
        <b>Round {data.currentRound+1}/{data.rounds.length},
          Stage: {curRound.currentStage+1}/{curRound.stages.length},
          StartDate: {curStage?.startDate}</b>
      )}
      {data.status === 'ENDED' && curRound && (
        <b>Game ended :)</b>
      )}

    </Container>);

};
