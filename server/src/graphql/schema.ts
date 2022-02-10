import { builder } from './schemaBuilder';
import includeNodeUser from './nodes/user';
import includeNodePlayer from './nodes/player';
import includeCommonMutations from './commonMutations';
import { GraphQLSchema } from 'graphql';
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
import { GameStatus, Nation, RoleType } from '@prisma/client';
import includeNodeSendDiplomatAction from './nodes/sendDiplomatAction';
import { includeCommonSubscriptions } from './commonSubscriptions';
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

  includeNodeUser();
  includeNodePlayer();
  includeNodeCreateBombAction();
  includeNodeEconomicDepositAction();
  includeNodeGame();
  includeNodeStage();
  includeNodeRound();
  includeNodeSendBombAction();
  includeNodeSendDiplomatAction();
  includeNodeShieldCreationAction();
  includeNodeTeam();
  includeNodeTeamRoom();
  includeNodeTown();
  includeNodeTownLevel();

  includeCommonMutations();
  includeCommonQueries();
  includeCommonSubscriptions();

  includeWebRTC();

  return builder.toSchema({});
};

export default getGraphQLSchema;
