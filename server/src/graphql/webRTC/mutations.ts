import { builder, encodeGlobalID } from '../schemaBuilder';
import { AuthenticationError } from 'apollo-server';
import { ActionType, ActionTypeGql } from './types';
import { broadcastWebRTCEvent } from './subscriptions';
import { GQLContext } from 'src/app';

type SessionDescriptionDict = { [key: string]: RTCSessionDescriptionInit };

type IceCandidateDict = { [key: string]: RTCIceCandidate };

const actionResolvers = {
  [ActionType.RELAY_ICE]: (icd: IceCandidateDict, ctx: GQLContext) => {
    const user = ctx.user;
    if (user) {
      broadcastWebRTCEvent(ctx, {
        actionType: ActionType.ICE_CANDIDATE,
        data: JSON.stringify({
          creator: encodeGlobalID('User', user.id),
          icd: icd,
        }),
      });
    }
  },

  [ActionType.RELAY_SDP]: (sdd: SessionDescriptionDict, ctx: GQLContext) => {
    const user = ctx.user;
    if (user) {
      broadcastWebRTCEvent(ctx, {
        actionType: ActionType.SESSION_DESCRIPTION,
        data: JSON.stringify({
          creator: encodeGlobalID('User', user.id),
          sdd,
        }),
      });
    }
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
          actionResolver(JSON.parse(data), ctx);
          return true;
        } else {
          return false;
        }
      },
    }),
);
