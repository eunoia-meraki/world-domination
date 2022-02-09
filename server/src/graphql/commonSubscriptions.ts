import { User } from '@prisma/client';
import { GQLContext } from '../app';
import { WDSchemaBuilder } from './schemaBuilder';

const SuperPollingEventLabel = 'POST_EVENT';

export enum ActionType {
  JOIN = 'join',
  LEAVE = 'leave',
  SHARE_ROOMS = 'share-rooms',
  ADD_PEER = 'add-peer',
  REMOVE_PEER = 'remove-peer',
  RELAY_SDP = 'relay-sdp',
  RELAY_ICE = 'relay-ice',
  ICE_CANDIDATE = 'ice-candidate',
  SESSION_DESCRIPTION = 'session-description',
}

export class ActionEvent {
  actionType: ActionType;
  data: string;

  constructor(actionType: ActionType, data: string) {
    this.actionType = actionType;
    this.data = data;
  }
}

let users: (User | null)[] = [];

const joinEventHandler = (ctx: GQLContext) => {
  console.log(ActionType.JOIN, ctx.user?.id);
  superpollingEvent(
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
  superpollingEvent(
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

const includeCommonSubscriptions = (builder: WDSchemaBuilder) => {
  const ActionTypeGql = builder.enumType(ActionType, {
    name: 'ActionType',
  });

  const ActionEventGqlType = builder.objectType(ActionEvent, {
    name: 'ActionEvent',
    fields: (t) => ({
      actionType: t.field({
        type: ActionTypeGql,
        resolve: (event) => {
          return event.actionType;
        },
      }),
      data: t.field({
        type: 'String',
        resolve: (event) => {
          return event.data;
        },
      }),
    }),
  });

  builder.subscriptionType({
    fields: (t) => ({
      superpolling: t.field({
        authScopes: {
          public: true,
        },
        type: ActionEventGqlType,
        args: {},
        subscribe: (_, __, ctx) => {
          return withCallbacks(
            ctx.pubsub.asyncIterator(SuperPollingEventLabel),
            () => joinEventHandler(ctx),
            () => removePeerEventHandler(ctx),
          );
        },
        resolve: async (payload) => payload as ActionEvent,
      }),
    }),
  });
};

export async function superpollingEvent(
  context: GQLContext,
  event: ActionEvent,
) {
  await context.pubsub.publish(SuperPollingEventLabel, event);
}

export default includeCommonSubscriptions;
