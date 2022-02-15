import { Box } from '@mui/material';
import { Outlet } from 'react-location';

import type { FC } from 'react';
import { useState } from 'react';

import { Header } from './Header';
import { Navigation } from './Navigation';

import { Contents } from '@/enumerations';

export const Game: FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [content, setContent] = useState<Contents>(Contents.ConferenceHall);

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

      <Outlet />
    </Box>
  );
};
