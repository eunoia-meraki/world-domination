import { Link, Outlet } from 'react-location';
import graphql from 'babel-plugin-relay/macro';

import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSubscription } from 'react-relay';
import useWebRTC, { LOCAL_VIDEO } from '@/hooks/useWebRTC';
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

const layout = (clientsNumber = 1) => {
  const pairs = Array.from({ length: clientsNumber })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .reduce<any>((acc, next, index, arr) => {
    if (index % 2 === 0) {
      acc.push(arr.slice(index, index + 2));
    }

    return acc;
  }, []) as string[][];

  const rowsNumber = pairs.length;
  const height = `${100 / rowsNumber}%`;

  return pairs.map((row, index, arr) => {

    if (index === arr.length - 1 && row.length === 1) {
      return [{
        width: '100%',
        height,
      }];
    }

    return row.map(() => ({
      width: '50%',
      height,
    }));
  }).flat();
};

export const Game: FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [content, setContent] = useState<Contents>(Contents.ConferenceHall);
  const [rooms, updateRooms] = useState([]);

  const {
    params: { gameid },
  } = useMatch();

  const { clients, provideMediaRef } = useWebRTC(gameid);
  const videoLayout = layout(clients.length);

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
    >
      <Navigation open={open} setContent={setContent} content={content}/>

      <Header open={open} toggleOpen={toggleOpen} content={content} />

      {clients.map((clientID, index) => {
          return (
            <div key={clientID} style={videoLayout[index]} id={clientID}>
              <video
                width='100%'
                height='100%'
                ref={instance => {
                  provideMediaRef(clientID, instance);
                }}
                autoPlay
                playsInline
                muted={clientID === LOCAL_VIDEO}
              />
            </div>
          );
        })}

      <Outlet />
    </Box>
  );
};
