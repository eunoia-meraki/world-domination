import { User } from '@prisma/client';
import { GQLContext } from '../../app';
import { builder, encodeGlobalID } from '../schemaBuilder';
import {
  WebRTCActionEvent,
  ActionEventGqlType,
  WebRTCActionType,
} from './types';

// TODO move to db
const rooms: { [room: string]: User[] } = {};

const withOnUnsubscribe = (
  asyncIterator: AsyncIterator<unknown, any, undefined>,
  onUnsubscribe: () => void,
) => {
  const asyncReturn = asyncIterator.return;

  asyncIterator.return = () => {
    onUnsubscribe();
    return asyncReturn
      ? asyncReturn.call(asyncIterator)
      : Promise.resolve({ value: undefined, done: true });
  };

  return asyncIterator as any;
};

export const webRtcSubscription = builder.subscriptionField('webRTC', (t) =>
  t.field({
    authScopes: {
      public: true,
    },
    type: ActionEventGqlType,
    args: {
      roomId: t.arg.string({ required: true }),
    },
    subscribe: (_, { roomId }, ctx) => {
      const confId = `${roomId}_voiceChat`; // TODO: subcribe stage id
      // need to wait until the new client subscribes (after current finction returns)
      setTimeout(() => {
        addPeerEventHandler(ctx, confId);
        console.log(`User ${ctx.user?.login} joined the room ${confId}`);
      });
      return withOnUnsubscribe(ctx.pubsub.asyncIterator(confId), () => {
        removePeerEventHandler(ctx, confId);
        console.log(`User ${ctx.user?.login} leaved the room ${confId}`);
      });
    },
    resolve: (payload) => payload as WebRTCActionEvent,
  }),
);

export const broadcastWebRTCEvent = (
  ctx: GQLContext,
  event: WebRTCActionEvent,
) => {
  const roomEntry = Object.entries(rooms).find((e) =>
    e[1].find((u) => u.id === ctx.user?.id),
  ); // later can get from user

  if (roomEntry) {
    const roomId = roomEntry[0];
    ctx.pubsub.publish(roomId, event);
  }
};

const addPeerEventHandler = (ctx: GQLContext, roomId: string) => {
  const user = ctx.user;

  if (!rooms[roomId]) {
    rooms[roomId] = [];
  }

  if (user) {
    rooms[roomId].push(user);

    const to = rooms[roomId]
      .map((u) => u?.id)
      .filter((id) => id && id !== user.id)
      .map((id) => encodeGlobalID('User', id));

    if (to.length !== 0) {
      broadcastWebRTCEvent(ctx, {
        actionType: WebRTCActionType.ADD_PEER,
        data: JSON.stringify({
          offerCreator: encodeGlobalID('User', user.id),
          to,
        }),
      });
    }
  }
};

const removePeerEventHandler = (ctx: GQLContext, roomId: string) => {
  const user = ctx.user;

  if (user && rooms[roomId]) {
    broadcastWebRTCEvent(ctx, {
      actionType: WebRTCActionType.REMOVE_PEER,
      data: JSON.stringify({
        disconnected: encodeGlobalID('User', user.id),
      }),
    });

    rooms[roomId] = rooms[roomId].filter((u) => u?.id !== ctx.user?.id);
  }
};
