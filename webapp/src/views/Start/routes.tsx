import type { Route } from 'react-location';

import { Routes } from '@/enumerations';

import { Start } from './Start';

export const StartRoutes: Route = {
  path: Routes.Start,
  element: <Start />,
};
