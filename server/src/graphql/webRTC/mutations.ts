import { builder } from '../schemaBuilder';
import { AuthenticationError } from 'apollo-server';
import { ActionEvent, ActionType, ActionTypeGql } from './types';
import { broadcastWebRTCEvent } from './subscriptions';
import { GQLContext } from 'src/app';

const actionResolvers = {
  [ActionType.RELAY_ICE]: (data: string, ctx: GQLContext) =>
    console.log(ActionType.RELAY_ICE, data),

  [ActionType.RELAY_SDP]: (data: string, ctx: GQLContext) =>
    console.log(ActionType.RELAY_SDP, data),

  [ActionType.JOIN]: (data: string, ctx: GQLContext) => {
    console.log(ActionType.JOIN, data);
    broadcastWebRTCEvent(ctx, { actionType: ActionType.JOIN, data });
  },
};

export const interactWebRTCMutation = builder.mutationField(
  'interactWebRTC',
  (t) =>
    t.field({
      type: 'Boolean',
      authScopes: {
        public: true,
      },
      args: {
        actionType: t.arg({
          type: ActionTypeGql,
          required: true,
        }),
        data: t.arg.string({ required: true }),
      },
      resolve: async (_, { actionType, data }, ctx) => {
        if (!ctx.user) {
          throw new AuthenticationError('Неверный логин или пароль');
        }

        const actionResolver = actionResolvers[actionType];

        if (actionResolver) {
          actionResolver(data, ctx);
          return true;
        } else {
          return false;
        }
      },
    }),
);
