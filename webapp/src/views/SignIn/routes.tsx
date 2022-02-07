import { SignIn } from './SignIn';

import { Routes } from '../../enumerations';

import type { Route } from 'react-location';

export const SignInRoutes: Route = {
  path: Routes.SignIn,
  element: <SignIn />,
};
