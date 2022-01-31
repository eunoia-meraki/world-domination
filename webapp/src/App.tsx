import { FC } from 'react';

import { hot } from 'react-hot-loader/root';

import graphql from 'babel-plugin-relay/macro';

export const App: FC = () => (
  <h1>
    Hello!
  </h1>
);

export default hot(App);
