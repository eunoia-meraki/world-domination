import { Link, Outlet } from 'react-location';
import graphql from 'babel-plugin-relay/macro';

import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSubscription } from 'react-relay';
import type { Game_SuperpollingSubscription } from './__generated__/Game_SuperpollingSubscription.graphql';
import { Contents } from '@/enumerations';
import { Navigation } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Header } from './Header';

const voiceChatSubscription = graphql`
  subscription Game_SuperpollingSubscription {
    superpolling {
      actionType
      data
    }
  }
`;

export const Game: FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [content, setContent] = useState<Contents>(Contents.ConferenceHall);
  const [rooms, updateRooms] = useState([]);

  const rootNode = useRef<HTMLDivElement | null>(null);
  useSubscription<Game_SuperpollingSubscription>({
    subscription: voiceChatSubscription,
    variables:{},
    onCompleted: () => console.log('onCompleted'),
    onError: e => console.log('onError', e),
    onNext: response => console.log('onNext', response?.superpolling),
  });

  const toggleOpen = (): void => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
      }}
      ref={rootNode}
    >
      <Navigation open={open} setContent={setContent} content={content}/>

      <Header open={open} toggleOpen={toggleOpen} content={content} />

      <Outlet />
    </Box>
  );
};
