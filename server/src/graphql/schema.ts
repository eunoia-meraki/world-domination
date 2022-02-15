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
import { GameActionType, GameStatus, Nation, RoleType } from '@prisma/client';
import { includeCommonSubscriptions } from './commonSubscriptions';
import { includeWebRTC } from './webRTC';
import includeAction from './nodes/action';
import includeNodeDevelopNuclearTechnologyAction from './nodes/developNuclearTechnologyAction';
import includeNodeEcologyDepositAction from './nodes/ecologyDepositAction';
import includeNodeSanctionsAction from './nodes/sanctionsAction';

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
  includeNodeSanctionsAction();
  includeNodeTeam();
  includeNodeTeamRoom();
  includeNodeTown();
  includeNodeTownLevel();

  includeCommonQueries();
  includeCommonMutations();
  includeCommonSubscriptions();

  includeWebRTC();

  return builder.toSchema({});
};

export default getGraphQLSchema;
