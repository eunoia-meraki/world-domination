import type { Route } from 'react-location';

import { Routes } from '../../enumerations';

import { Auth } from './Auth';

export const AuthRoutes: Route = {
  path: Routes.Auth,
  element: <Auth />,
};
