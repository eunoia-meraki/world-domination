import { GQLContext } from '../app';
import { WDSchemaBuilder } from './schemaBuilder';

const SuperPollingEventLabel = 'POST_EVENT';

const includeCommonSubscriptions = (builder: WDSchemaBuilder) => {
  builder.subscriptionType({
    fields: (t) => ({
      superpolling: t.field({
        authScopes: {
          public: true,
        },
        type: 'String',
        args: {
          something: t.arg.string({ required: true }),
        },
        subscribe: (_, { something }, ctx) =>
          withCallbacks(
            ctx.pubsub.asyncIterator(SuperPollingEventLabel),
            () => console.log('subscribed', ctx.user?.id, something),
            () => console.log('unsubscribed', ctx.user?.id, something),
          ),
        resolve: async (payload) => payload as string,
      }),
    }),
  });
};

const withCallbacks = (
  asyncIterator: AsyncIterator<unknown, any, undefined>,
  onSubscribe: () => void,
  onUnsubscribe: () => void,
): AsyncIterable<unknown> => {
  onSubscribe();

  const asyncReturn = asyncIterator.return;

  asyncIterator.return = () => {
    onUnsubscribe();
    return asyncReturn
      ? asyncReturn.call(asyncIterator)
      : Promise.resolve({ value: undefined, done: true });
  };

  return asyncIterator as any;
};

export async function superpollingEvent(context: GQLContext, event: string) {
  await context.pubsub.publish(SuperPollingEventLabel, event);
}

export default includeCommonSubscriptions;
