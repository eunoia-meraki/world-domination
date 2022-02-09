import graphql from 'babel-plugin-relay/macro';
import { useMatch } from 'react-location';
import { usePreloadedQuery } from 'react-relay';

import type { FC } from 'react';

import type { GamesLocation } from './GamesLocation';
import type { GamesQuery } from './__generated__/GamesQuery.graphql';

export const Games: FC = () => {
  const {
    data: { gamesRef },
  } = useMatch<GamesLocation>();

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

  // eslint-disable-next-line no-console
  console.log(games);

  return (
    <div>
      qwerty
      <ul>
        {games.map(g => (
          <li key={g?.id}>{g?.name}</li>
        ))}
      </ul>
    </div>
  );
};
