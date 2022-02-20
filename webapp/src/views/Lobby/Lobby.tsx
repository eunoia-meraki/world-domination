import { Button } from '@mui/material';
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
      mutation Lobby_leaveGame_Mutation($gameId: ID!) {
        leaveGame(gameId: $gameId) {
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
        variables: {
          gameId: currentGame.id,
        },
      });
    }
  };

  return (
    <>
      <Header userLogin={userData.authorizedUser.login} />

      <MatchRoute to=".">
        {currentGame
          ? <>
            <Button variant="outlined" onClick={() => navigate({ to: `${Routes.Lobby}/${currentGame.id}` })}>
              Continue
            </Button>
            <Button variant="outlined" title='Leave' onClick={leaveGame}>
              Leave
            </Button>
          </>
          : <GamesList gamesList={userData.authorizedUser} />
        }
      </MatchRoute>

      <Outlet />

      <Footer />
    </>
  );
};
