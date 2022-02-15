import graphql from 'babel-plugin-relay/macro';
import { useMatch, useNavigate } from 'react-location';
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';

import type { FC } from 'react';

import type { LobbiesLocation } from './LobbiesLocation';
import type { Lobbies_games_Query } from './__generated__/Lobbies_games_Query.graphql';

import { Routes } from '@/enumerations';

export const Lobbies: FC = () => {
  const {
    data: { gamesRef },
  } = useMatch<LobbiesLocation>();

  const navigate = useNavigate();

  const data = usePreloadedQuery<Lobbies_games_Query>(
    graphql`
      query Lobbies_games_Query {
        games {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
    gamesRef as PreloadedQuery<Lobbies_games_Query, Record<string, unknown>>,
  );

  const games = data.games.edges.filter(edge => edge).map(edge => edge!.node) ?? [];

  return (
    <div>
      <h1>Lobbies list</h1>
      <ul>
        {games.map(g => (
          <li key={g.id}>
            <button type='button' onClick={() => navigate({ to: `${Routes.Lobby}/${g.id}` })}>
              {g.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
