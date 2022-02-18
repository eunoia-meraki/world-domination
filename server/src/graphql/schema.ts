import { GraphQLSchema } from 'graphql';

import { GameActionType, GameStatus, Nation, RoleType } from '@prisma/client';

import includeAuthMutations from './authMutations';
import { includeCommonSubscriptions } from './commonSubscriptions';

import { builder } from './schemaBuilder';
import includeNodeUser from './nodes/user';
import includeGameMutations from './gameMutations';
import includeNodePlayer from './nodes/player';
import includeNodeCreateBombAction from './nodes/createBombAction';
import includeNodeEconomicDepositAction from './nodes/economicDepositAction';
import includeNodeGame from './nodes/game';
import includeNodeRound from './nodes/round';
import includeNodeSendBombAction from './nodes/sendBombAction';
import includeNodeShieldCreationAction from './nodes/shieldCreationAction';
import includeNodeTeam from './nodes/team';
import includeNodeTeamRoom from './nodes/teamRoom';
import includeNodeTownLevel from './nodes/townLevel';
import includeCommonQueries from './commonQueries';
import includeNodeStage from './nodes/stage';
import includeNodeTown from './nodes/town';
import includeAction from './nodes/action';
import includeNodeDevelopNuclearTechnologyAction from './nodes/developNuclearTechnologyAction';
import includeNodeEcologyDepositAction from './nodes/ecologyDepositAction';
import includeNodeSanctionAction from './nodes/sanctionAction';
import { includeWebRTC } from './webRTC';

const getGraphQLSchema = (): GraphQLSchema => {
  // TODO uncomment later
  // builder.queryType({});
  builder.mutationType({});
  builder.subscriptionType({});

  builder.enumType(GameStatus, {
    name: 'GameStatus',
  });

  builder.enumType(Nation, {
    name: 'Nation',
  });

  builder.enumType(RoleType, {
    name: 'RoleType',
  });

  builder.enumType(GameActionType, {
    name: 'GameActionType',
  });

  includeNodeUser();
  includeNodePlayer();
  includeNodeGame();
  includeNodeStage();
  includeNodeRound();
  includeAction();
  includeNodeSendBombAction();
  includeNodeShieldCreationAction();
  includeNodeCreateBombAction();
  includeNodeEconomicDepositAction();
  includeNodeDevelopNuclearTechnologyAction();
  includeNodeEcologyDepositAction();
  includeNodeSanctionAction();
  includeNodeTeam();
  includeNodeTeamRoom();
  includeNodeTown();
  includeNodeTownLevel();

  includeCommonQueries();
  includeAuthMutations();
  includeGameMutations();
  includeCommonSubscriptions();

  includeWebRTC();

  return builder.toSchema({});
};

export default getGraphQLSchema;
