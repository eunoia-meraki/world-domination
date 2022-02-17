import { Box } from '@mui/material';
import graphql from 'babel-plugin-relay/macro';
import { Outlet, useMatch } from 'react-location';
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';

import type { FC } from 'react';
import { useState } from 'react';

import { Header } from './Header';
import { Navigation } from './Navigation';

import type { GameLocation } from './GameLocation';
import type { Game_game_Query } from './__generated__/Game_game_Query.graphql';

import { Contents } from '@/enumerations';
import { ConferenceHall } from './ConferenceHall';
import { VoiceChat } from './VoiceChat';

export const Game: FC = () => {
  const {
    data: { gameRef },
  } = useMatch<GameLocation>();

  usePreloadedQuery<Game_game_Query>(
    graphql`
      query Game_game_Query($gameId: ID!) {
        node(id: $gameId) {
          id
          ... on Game {
            clients {
              id
              login
            }
          }
        }
      }
    `,
    gameRef as PreloadedQuery<Game_game_Query, Record<string, unknown>>,
  );

  const userId = sessionStorage.getItem('userId') || '';

  const [open, setOpen] = useState<boolean>(true);
  const [content, setContent] = useState<Contents>(Contents.ConferenceHall);

  const toggleOpen = (): void => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Navigation open={open} setContent={setContent} content={content}/>

      <Header open={open} toggleOpen={toggleOpen} content={content} />

      <Outlet />

      <VoiceChat userId={userId}/>
    </Box>
  );
};
