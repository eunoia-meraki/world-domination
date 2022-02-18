import graphql from 'babel-plugin-relay/macro';
import { MatchRoute, Outlet, useMatch } from 'react-location';
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';

import type { FC } from 'react';

import { GamesList } from './GamesList';
import { Header } from './Header';

import type { LobbyLocation } from './LobbyLocations';
import type { Lobby_authorizedUser_Query } from './__generated__/Lobby_authorizedUser_Query.graphql';

import { Footer } from '@/components/Footer';

export const Lobby: FC = () => {
  const {
    data: { authorizedUserRef: userRef },
  } = useMatch<LobbyLocation>();

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
    userRef as PreloadedQuery<Lobby_authorizedUser_Query, Record<string, unknown>>,
  );

  return (
    <>
      <MatchRoute to=".">
        <Header userLogin={userData.authorizedUser.login}/>
        <GamesList gamesList={userData.authorizedUser}/>
        <Footer />
      </MatchRoute>
      <Outlet/>
    </>
  );
};
