import { builder } from '../schemaBuilder';

export enum WebRTCActionType {
  JOIN = 'join',
  LEAVE = 'leave',
  ADD_PEER = 'add-peer',
  REMOVE_PEER = 'remove-peer',
  RELAY_SDP = 'relay-sdp',
  RELAY_ICE = 'relay-ice',
  ICE_CANDIDATE = 'ice-candidate',
  SESSION_DESCRIPTION = 'session-description',
}

export class WebRTCActionEvent {
  actionType: WebRTCActionType;
  data: string;

  constructor(actionType: WebRTCActionType, data: string) {
    this.actionType = actionType;
    this.data = data;
  }
}

export const ActionTypeGql = builder.enumType(WebRTCActionType, {
  name: 'WebRTCActionType',
});

export const ActionEventGqlType = builder.objectType(WebRTCActionEvent, {
  name: 'WebRTCActionEvent',
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
