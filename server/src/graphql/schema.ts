import { getSchemaBuilder } from './schemaBuilder';
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
import includeCommonSubscriptions from './commonSubscriptions';
import includeNodeSendDiplomatAction from './nodes/sendDiplomatAction';

const getGraphQLSchema = (): GraphQLSchema => {
  const builder = getSchemaBuilder();

  builder.enumType(GameStatus, {
    name: 'GameStatus',
  });

  builder.enumType(Nation, {
    name: 'Nation',
  });

  builder.enumType(RoleType, {
    name: 'RoleType',
  });

  includeNodeUser(builder);
  includeNodePlayer(builder);
  includeNodeCreateBombAction(builder);
  includeNodeEconomicDepositAction(builder);
  includeNodeGame(builder);
  includeNodeStage(builder);
  includeNodeRound(builder);
  includeNodeSendBombAction(builder);
  includeNodeSendDiplomatAction(builder);
  includeNodeShieldCreationAction(builder);
  includeNodeTeam(builder);
  includeNodeTeamRoom(builder);
  includeNodeTown(builder);
  includeNodeTownLevel(builder);

  includeCommonMutations(builder);
  includeCommonQueries(builder);

  includeCommonSubscriptions(builder);

  return builder.toSchema({});
};

export default getGraphQLSchema;
