import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-location';

import type { FC } from 'react';
import React from 'react';

import { Header } from './Header';

interface IContent {
  open: boolean;
  toggleOpen: () => void;
  heading: string;
}

export const Content: FC<IContent> = ({ open, toggleOpen, heading }) => (
  <React.Fragment>
    <Header open={open} toggleOpen={toggleOpen} heading={heading} />
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
