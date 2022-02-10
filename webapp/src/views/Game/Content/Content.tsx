import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-location';

import type { FC } from 'react';
import React from 'react';

import { Header } from './Header';
import { Contents } from '@/enumerations';

interface IContent {
  open: boolean;
  toggleOpen: () => void;
  content: Contents;
}

export const Content: FC<IContent> = ({ open, toggleOpen, content }) => (
  <React.Fragment>
    <Header open={open} toggleOpen={toggleOpen} content={content} />
    <Box
      component="main"
      sx={{
        backgroundColor: theme =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        flexGrow: 1,
        overflow: 'auto',
      }}
    >
      <Toolbar />

      <Outlet />
    </Box>
  </React.Fragment>
);
