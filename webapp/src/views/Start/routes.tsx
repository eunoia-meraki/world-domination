import { Start } from './Start';

import type { Route } from 'react-location';

import { Routes } from '@/enumerations';

export const StartRoutes: Route = {
  path: Routes.Start,
  element: <Start />,
};
