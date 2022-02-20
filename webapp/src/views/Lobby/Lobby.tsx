import { Button, Box } from '@mui/material';
import graphql from 'babel-plugin-relay/macro';
import { MatchRoute, Outlet, useMatch, useNavigate } from 'react-location';
import { PreloadedQuery, useMutation, usePreloadedQuery } from 'react-relay';

import type { FC } from 'react';

import { GamesList } from './GamesList';
import { Header } from './Header';

import type { LobbyLocation } from './LobbyLocations';
import type { Lobby_authorizedUser_Query } from './__generated__/Lobby_authorizedUser_Query.graphql';
import type { Lobby_leaveGame_Mutation } from './__generated__/Lobby_leaveGame_Mutation.graphql';

import { Footer } from '@/components/Footer';
import { Routes } from '@/enumerations';

export const Lobby: FC = () => {
  const {
    data: { authorizedUserRef },
  } = useMatch<LobbyLocation>();

  const navigate = useNavigate();

  const userData = usePreloadedQuery<Lobby_authorizedUser_Query>(
    graphql`
      query Lobby_authorizedUser_Query {
        authorizedUser {
          id
          login
          currentGame {
            id
          }
          ...GamesList_games_Fragment
        }
      }
    `,
    authorizedUserRef as PreloadedQuery<Lobby_authorizedUser_Query, Record<string, unknown>>,
  );

  const { currentGame } = userData.authorizedUser;

  const [leave] = useMutation<Lobby_leaveGame_Mutation>(
    graphql`
      mutation Lobby_leaveGame_Mutation {
        leaveGame {
          id
          login
          currentGame {
            id
          }
          ...GamesList_games_Fragment
        }
      }
    `,
  );

  const leaveGame = () => {
    if (currentGame) {
      leave({
        variables: {},
        onCompleted: () => navigate({ to: `${Routes.Lobby}` }),
        onError: () => {},
      });
    }
  };

  const onContinueClick = () => {
    if (currentGame) {
      navigate({ to: `${Routes.Lobby}/${currentGame.id}` });
    }
  };

  return (
    <>
      <Header
        userLogin={userData.authorizedUser.login}
        currentGame={!!currentGame}
        leaveGame={leaveGame}
      />

      <MatchRoute to=".">
        {currentGame ? (
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button variant="contained" onClick={onContinueClick}>
              Continue
            </Button>
          </Box>
        ) : (
          <GamesList gamesList={userData.authorizedUser} />
        )}
      </MatchRoute>

      <Outlet />

      <Footer />
    </>
  );
};
