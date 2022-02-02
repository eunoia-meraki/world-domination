import { FC } from 'react';

import { Outlet, ReactLocation, Router } from 'react-location';

import { ReactLocationDevtools } from 'react-location-devtools';

import { Box } from '@mui/material';

import { Footer } from './components/Footer';

import { routes } from './routes';

export const App: FC = () => {
  const location = new ReactLocation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Router location={location} routes={routes}>
        <Outlet />
        <ReactLocationDevtools initialIsOpen={false} />
      </Router>
      <Footer />
    </Box>
  );
};
