import { Box } from '@mui/material';
import { Outlet, useMatch } from 'react-location';

import type { FC } from 'react';
import { useState } from 'react';

import { Header } from './Header';
import { Navigation } from './Navigation';

import { Contents } from '@/enumerations';
import useWebRTC, { LOCAL_VIDEO } from '@/hooks/useWebRTC';

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

  const {
    params: { gameid },
  } = useMatch();

  const { clients, provideMediaRef } = useWebRTC(gameid);
  const videoLayout = layout(clients.length);

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

      {clients.map((clientID, index) => (
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
      ))}

      <Outlet />
    </Box>
  );
};
