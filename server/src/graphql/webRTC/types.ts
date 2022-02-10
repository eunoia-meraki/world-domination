import { builder } from '../schemaBuilder';

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

export const ActionTypeGql = builder.enumType(ActionType, {
  name: 'ActionType',
});

export const ActionEventGqlType = builder.objectType(ActionEvent, {
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
