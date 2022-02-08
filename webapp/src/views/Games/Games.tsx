import graphql from 'babel-plugin-relay/macro';
import { useMatch } from 'react-location';
import { usePreloadedQuery } from 'react-relay';

import { FC } from 'react';

import { GamesLocation } from './GamesLocation';
import { GamesQuery } from './__generated__/GamesQuery.graphql';

export const Games: FC = () => {
  const {
    data: { gamesRef },
  } = useMatch<GamesLocation>();

  // if (!gamesRef) {
  //   return null;
  // }

  const data = usePreloadedQuery<GamesQuery>(
    graphql`
      query GamesQuery {
        games {
          edges {
            node {
              id
            }
          }
        }
      }
    `,
    gamesRef!,
  );

  // console.log(data);

  return (
    <div>
      {data}
    </div>
  );
};
