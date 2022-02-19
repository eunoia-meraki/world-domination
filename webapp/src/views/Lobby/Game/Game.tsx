import { Box } from '@mui/material';
import graphql from 'babel-plugin-relay/macro';
import { MatchRoute, useMatch } from 'react-location';
import { usePreloadedQuery } from 'react-relay';

import { FC , useState } from 'react';

import { Actions } from './Actions';
import { CountryStatistics } from './CountryStatistics';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { VoiceChat } from './VoiceChat';
import { WorldStatistics } from './WorldStatistics';

import { SortingRoom } from '../SortingRoom';

import type { LobbyLocation } from '../LobbyLocations';
import type { Game_game_Query } from './__generated__/Game_game_Query.graphql';

import { Contents } from '@/enumerations';

export const Game: FC = () => {
  const {
    data: { gameRef },
  } = useMatch<LobbyLocation>();

  const [open, setOpen] = useState<boolean>(true);
  const [content, setContent] = useState<Contents>(Contents.ConferenceHall);

  const data = usePreloadedQuery<Game_game_Query>(
    graphql`
      query Game_game_Query($gameId: ID!) {
        node(id: $gameId) {
          id 
          ... on Game {
            ...VoiceChat_clients_Fragment

            clients {
              id
              login
            }
        
            teams {
              players {
                roles
                users {
                  login
                  id
                }
              }
              nation
            }
          }
        }
        authorizedUser {
          id
        }
      }
    `,
    gameRef!,
  );

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

      <MatchRoute to=".">
        <SortingRoom />
      </MatchRoute>

      <MatchRoute to="countrystatistics">
        <CountryStatistics />
      </MatchRoute>

      <MatchRoute to="worldstatistics">
        <WorldStatistics />
      </MatchRoute>

      <MatchRoute to="actions">
        <Actions />
      </MatchRoute>

      {/* TODO handle it */}
      <VoiceChat userId={data.authorizedUser.id} data={data.node!}/>
    </Box>
  );
};
