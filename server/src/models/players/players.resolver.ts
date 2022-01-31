import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AddPlayerInput } from './dto/add-player.input';
import { PlayersService } from './players.service';
import { Player } from './schemas/player.schema';

const pubSub = new PubSub();

@Resolver(() => Player)
export class PlayersResolver {
  constructor(private readonly playersService: PlayersService) {}

  @Query(() => Player)
  async player(@Args('id') id: string): Promise<Player> {
    const player = await this.playersService.findOneById(id);
    if (!player) {
      throw new NotFoundException(id);
    }
    return player;
  }

  @Query(() => [Player])
  players(): Promise<Player[]> {
    return this.playersService.findAll();
  }

  @Mutation(() => Player)
  async addPlayer(
    @Args('newPlayerData') newPlayerData: AddPlayerInput,
  ): Promise<Player> {
    // TODO check types
    const user = await this.playersService.create(newPlayerData);
    pubSub.publish('userAdded', { userAdded: user });
    return user;
  }
}
