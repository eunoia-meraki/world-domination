import { render } from 'react-dom';
import { RelayEnvironmentProvider } from 'react-relay';

import { App } from './App';
import { RelayEnvironment } from './RelayEnvironment';

import './App.css';

const RelayApp = () => (
  <RelayEnvironmentProvider environment={RelayEnvironment}>
    <App />
  </RelayEnvironmentProvider>
);

render(<RelayApp />, document.getElementById('app'));
