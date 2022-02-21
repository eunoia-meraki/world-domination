import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import { GQLContext } from 'src/app';
import PrismaTypes from '../../prisma/generated';
import { db } from '../database/db';

export type SBProps = {
  PrismaTypes: PrismaTypes;
  AuthScopes: {
    public: boolean;
  };
  Context: GQLContext;
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
};

export type WDSchemaBuilder = PothosSchemaTypes.SchemaBuilder<
  PothosSchemaTypes.ExtendDefaultTypes<SBProps>
>;

export const encodeGlobalID = (typename, id) =>
  Buffer.from(`${typename}\n${id}`).toString('base64');

export const decodeGlobalID = (globalId: string) => {
  const [typename, id] = Buffer.from(globalId, 'base64')
    .toString('ascii')
    .split('\n');
  return { typename, id };
};

export const builder = new SchemaBuilder<SBProps>({
  plugins: [ScopeAuthPlugin, PrismaPlugin, RelayPlugin],
  authScopes: (context) => {
    const user = context.user;
    return {
      public: !!user,
    };
  },
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String',
    encodeGlobalID,
    decodeGlobalID,
  },
  prisma: {
    client: db,
  },
});
