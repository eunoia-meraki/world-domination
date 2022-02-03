import type { Route } from 'react-location';

import { Routes } from '../../enumerations';

import { SignUp } from './SignUp';

export const SignUpRoutes: Route = {
  path: Routes.SignUp,
  element: <SignUp />,
};
