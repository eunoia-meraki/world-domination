import { Outlet, ReactLocation, Router } from 'react-location';
import { ReactLocationDevtools } from 'react-location-devtools';

import type { FC } from 'react';
import { Suspense } from 'react';

import './App.css';

import { FullPageLoading } from './components/FullPageLoading';
import { routes } from './routes';

import type { Route } from 'react-location';

export const App: FC = () => {
  const location = new ReactLocation();

  return (
    <Router location={location} routes={routes as Route[]}>
      <Suspense fallback={<FullPageLoading />}>
        <Outlet />
      </Suspense>

      <ReactLocationDevtools initialIsOpen={false} />
    </Router>
  );
};
