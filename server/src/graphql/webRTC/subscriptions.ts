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
        () => joinEventHandler(ctx),
        () => removePeerEventHandler(ctx),
      );
    },
    resolve: async (payload) => payload as ActionEvent,
  }),
);

export async function broadcastWebRTCEvent(
  context: GQLContext,
  event: ActionEvent,
) {
  await context.pubsub.publish(BroadcastWebRTCEventLabel, event);
}

const joinEventHandler = (ctx: GQLContext) => {
  console.log(ActionType.JOIN, ctx.user?.id);
  broadcastWebRTCEvent(
    ctx,
    new ActionEvent(
      ActionType.ADD_PEER,
      `{"createOffer":${ctx.user?.id}, "to": ${users
        .map((u) => u?.id)
        .filter((id) => id && id != ctx.user?.id)}}`,
    ),
  );

  users.push(ctx.user);
};

const removePeerEventHandler = (ctx: GQLContext) => {
  console.log(ActionType.REMOVE_PEER, ctx.user?.id);
  broadcastWebRTCEvent(
    ctx,
    new ActionEvent(
      ActionType.REMOVE_PEER,
      `{"remove": ${ctx.user?.id}, "from": ${users
        .map((u) => u?.id)
        .filter((u) => u)}}`,
    ),
  );

  users = users.filter((u) => u?.id !== ctx.user?.id);
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
