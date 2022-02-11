import { User } from '@prisma/client';
import { GQLContext } from '../../app';
import { builder } from '../schemaBuilder';
import { ActionEvent, ActionEventGqlType, ActionType } from './types';

const BroadcastWebRTCEventLabel = 'POST_EVENT';

// TODO move to db
let users: (User | null)[] = [];

export const webRtcSubscription = builder.subscriptionField('webRTC', (t) =>
  t.field({
    authScopes: {
      public: true,
    },
    type: ActionEventGqlType,
    args: {},
    subscribe: (_, __, ctx) => {
      return withCallbacks(
        ctx.pubsub.asyncIterator(BroadcastWebRTCEventLabel),
        () => addPeerEventHandler(ctx),
        () => removePeerEventHandler(ctx),
      );
    },
    resolve: (payload) => payload as ActionEvent,
  }),
);

export const broadcastWebRTCEvent = async (
  context: GQLContext,
  event: ActionEvent,
) => context.pubsub.publish(BroadcastWebRTCEventLabel, event);

const addPeerEventHandler = (ctx: GQLContext) => {
  const user = ctx.user;
  if (user) {
    const to = users.map((u) => u?.id).filter((id) => id && id != user?.id);
    if (to.length !== 0) {
      // Must rewrite this dirty stuff
      setTimeout(
        () =>
          broadcastWebRTCEvent(ctx, {
            actionType: ActionType.ADD_PEER,
            data: JSON.stringify({
              offerCreator: user.id,
              to,
            }),
          }),
        100,
      );
    }
  }

  users.push(ctx.user);
};

const removePeerEventHandler = (ctx: GQLContext) => {
  const user = ctx.user;
  if (user) {
    broadcastWebRTCEvent(ctx, {
      actionType: ActionType.REMOVE_PEER,
      data: JSON.stringify({
        disconnected: user.id,
      }),
    });
    users = users.filter((u) => u?.id !== ctx.user?.id);
  }
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
