/* eslint-disable camelcase */
import { CircularProgress, Container } from '@mui/material';
import graphql from 'babel-plugin-relay/macro';
import { useFragment } from 'react-relay';

import { FC, useEffect, useRef, useState } from 'react';

import type { GameStatus_game_Fragment$data, GameStatus_game_Fragment$key } from './__generated__/GameStatus_game_Fragment.graphql';

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
            livetime
          }
        }
      }
    `,
    game,
  );

  const [timer, setTimer] = useState('');

  const currentStage = useRef<GameStatus_game_Fragment$data['rounds'][0]['stages'][0]>();
  const currentRound = useRef<GameStatus_game_Fragment$data['rounds'][0]>();

  useEffect(() => {
    currentRound.current = data.rounds.find(round => round.order === data.currentRound);
    currentStage.current = currentRound.current?.stages
      .find(stage => stage.order === currentRound.current?.currentStage);
  }, [data]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!currentStage.current) {
        clearInterval(intervalId);
        return;
      }

      const start = new Date(currentStage.current.startDate as string).getTime();
      const now = new Date().getTime();
      const secondsPast = now - start;
      const elapsed = currentStage.current.livetime - secondsPast;
      const elapsedStr = new Date(elapsed).toISOString().substr(14, 5);

      setTimer(elapsed > 0 ? elapsedStr : '00:00');
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentStage, setTimer]);

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
      {data.status === 'ON_GOING' && currentRound.current && (
        <div>
          <p>Round {data.currentRound+1}/{data.rounds.length},
          Stage: {currentRound.current.currentStage+1}/{currentRound.current.stages.length},
          StartDate: {currentStage.current?.startDate}</p>
          <p>Timer: {timer}</p>
        </div>
      )}
      {data.status === 'ENDED' && currentRound.current && (
        <b>Game ended :)</b>
      )}

    </Container>);

};
