import type { Route } from 'react-location';

import { Routes } from '../../enumerations';

import { SignIn } from './SignIn';

export const SignInRoutes: Route = {
  path: Routes.SignIn,
  element: <SignIn />,
};
