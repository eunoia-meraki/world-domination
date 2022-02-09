import { Outlet, ReactLocation, Router } from 'react-location';
import { ReactLocationDevtools } from 'react-location-devtools';

import { FC } from 'react';

import './App.css';
import { routes } from './routes';

export const App: FC = () => {
  const location = new ReactLocation();

  return (
    <Router location={location} routes={routes}>
      <Outlet />

      <ReactLocationDevtools initialIsOpen={false} />
    </Router>
  );
};
