import { SignUp } from './SignUp';

import type { Route } from 'react-location';

import { Routes } from '@/enumerations';

export const SignUpRoutes: Route = {
  path: Routes.SignUp,
  element: <SignUp />,
};
