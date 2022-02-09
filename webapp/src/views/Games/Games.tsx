import graphql from 'babel-plugin-relay/macro';
import { useMatch, useNavigate } from 'react-location';
import { usePreloadedQuery } from 'react-relay';

import type { FC } from 'react';

import type { GamesLocation } from './GamesLocation';
import type { GamesQuery } from './__generated__/GamesQuery.graphql';

export const Games: FC = () => {
  const {
    data: { gamesRef },
  } = useMatch<GamesLocation>();

  const navigate = useNavigate();

  const data = usePreloadedQuery<GamesQuery>(
    graphql`
      query GamesQuery {
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
    gamesRef!,
  );

  const games = data.games.edges.map(edge => edge?.node) ?? [];

  return (
    <div>
      <h1>Lobbies list</h1>
      <ul>
        {games.map(g => (
          <li key={g?.id}>
            <button onClick={() => navigate({ to: g?.id })}>{g?.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
