import { Navigate } from 'react-location';

import type { Route } from 'react-location';

import { AuthRoutes } from './views/Auth/routes';
import { StartRoutes } from './views/Start/routes';

export const routes: Route[] = [
  AuthRoutes,
  StartRoutes,
  {
    element: <Navigate to="/" />,
  },
];
