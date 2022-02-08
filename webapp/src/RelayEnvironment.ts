/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { meros } from 'meros';
import {
  Store,
  Network,
  Environment,
  RecordSource,
  Observable as ReactObservable,
} from 'relay-runtime';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import type {
  Variables,
  FetchFunction,
  GraphQLResponse,
  SubscribeFunction,
  RequestParameters,
} from 'relay-runtime';
import type { Observer, Observable } from 'subscriptions-transport-ws';

/**
 * Relay requires developers to configure a "fetch" function that tells Relay how to load
 * the results of GraphQL queries from your server (or other data source). See more at
 * https://relay.dev/docs/en/quick-start-guide#relay-environment.
 */

const fetchQuery: FetchFunction = (
  params: RequestParameters,
  variables: Variables,
) => ReactObservable.create(sink => {
  (async () => {
    // Check that the auth token is configured
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8001/graphql', {
      body: JSON.stringify({
        query: params.text,
        variables,
      }),
      headers: {
        Authorization: `bearer ${token || ''}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const parts = await meros<GraphQLResponse>(response);

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (isAsyncIterable(parts)) {
      for await (const part of parts) {
        if (!part.json) {
          sink.error(new Error('Failed to parse part as json.'));
          break;
        }

        const result = part.body;

        // Realyism
        if ('hasNext' in result) {
          // @ts-ignore
          if (!result.extensions) result.extensions = {};
          // @ts-ignore
          result.extensions.is_final = !result.hasNext;
          // @ts-ignore
          delete result.hasNext;
        }

        sink.next(result);
      }
    } else {
      const json = await parts.json();

      if (Array.isArray(json.errors)) {
        const errorsMessage: string = json.errors
          .filter((error: { message?: string }) => error?.message !== undefined)
          .map((error: { message: string }) => error.message)
          .join('\n');
        sink.error(new Error(errorsMessage));
      }

      sink.next(json);
    }

    sink.complete();
  })();
});

const isAsyncIterable = (input: unknown): input is AsyncIterable<unknown> => (
  typeof input === 'object' &&
    input !== null &&
    // Some browsers still don't have Symbol.asyncIterator implemented (iOS Safari)
    // That means every custom AsyncIterable must be built using a AsyncGeneratorFunction
    // (async function * () {})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((input as any)[Symbol.toStringTag] === 'AsyncGenerator' || Symbol.asyncIterator in input)
);

const subscriptionClient = new SubscriptionClient('ws://localhost:8001/graphql', {
  reconnect: true,
  connectionParams: () => ({ token: localStorage.getItem('token') }),
});

// Mismatch type between relay and subscriptions-transport-ws
// https://github.com/facebook/relay/issues/3091
// https://github.com/facebook/relay/issues/3349
interface RelayObservableFixed<T = Record<string, unknown>> extends Observable<T> {
  subscribe(observer: Observer<T>): {
    unsubscribe: () => void;
    closed: boolean;
  };
}

const subscribe: SubscribeFunction = (request: RequestParameters, variables: Variables) => {
  const subscribeObservable = subscriptionClient.request({
    query: request.text as string | undefined,
    operationName: request.name,
    variables,
  });
  // Important: Convert subscriptions-transport-ws observable type to Relay's
  return ReactObservable.from(subscribeObservable as RelayObservableFixed<GraphQLResponse>);
};

const network = Network.create(fetchQuery, subscribe);

// Export a singleton instance of Relay Environment configured with our network layer:
export const RelayEnvironment = new Environment({
  network,
  store: new Store(new RecordSource(), {
    // This property tells Relay to not immediately clear its cache when the user
    // navigates around the app. Relay will hold onto the specified number of
    // query results, allowing the user to return to recently visited pages
    // and reusing cached data if its available/fresh.
    gcReleaseBufferSize: 10,
  }),
});
