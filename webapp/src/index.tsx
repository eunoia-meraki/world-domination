import { render } from 'react-dom';
import { RelayEnvironmentProvider } from 'react-relay';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { createContext } from 'react';

import { App } from './App';
import { RelayEnvironment } from './RelayEnvironment';

import './App.css';

interface IContext {
  subscriptionClient?: SubscriptionClient;
}

export const SubscriptionContext = createContext<IContext>({});

const RelayApp = () => {
  const subscriptionClient = new SubscriptionClient('ws://localhost:8001/graphql', {
    reconnect: true,
    connectionParams: () => ({ token: localStorage.getItem('token') }),
  });

  const value: IContext = { subscriptionClient };

  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <SubscriptionContext.Provider value={value}>
        <App />
      </SubscriptionContext.Provider>
    </RelayEnvironmentProvider>
  );
};

render(<RelayApp />, document.getElementById('app'));
