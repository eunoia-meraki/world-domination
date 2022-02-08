import { useMatch } from 'react-location';
import { graphql, usePreloadedQuery } from 'react-relay';

import { FC } from 'react';

import { GamesLocation } from './GamesLocation';
import { GamesQuery } from './__generated__/GamesQuery.graphql';

export const Games: FC = () => {
  const {
    data: { gamesRef },
  } = useMatch<GamesLocation>();

  usePreloadedQuery<GamesQuery>(
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

  return (
    <div>
      asdasdas
    </div>
  );
};
