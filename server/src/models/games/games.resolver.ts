import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PlayersService } from '../players/players.service';
import { AddGameDto } from './dto/add-game.dto';
import { AddGameInput } from './dto/add-game.input';
import { GamesService } from './games.service';
import { Game } from './schemas/game.schema';

const pubSub = new PubSub();

@Resolver(() => Game)
export class GamesResolver {
  constructor(
    private readonly gamesService: GamesService,
    private readonly playersService: PlayersService,
  ) {}

  @Query(() => Game)
  async game(@Args('id') id: string): Promise<Game> {
    const game = await this.gamesService.findOneById(id);
    if (!game) {
      throw new NotFoundException(id);
    }
    return game;
  }

  @Query(() => [Game])
  games(): Promise<Game[]> {
    return this.gamesService.findAll();
  }

  @Mutation(() => Game)
  async addGame(
    @Args('newGameInput') newGameInput: AddGameInput,
  ): Promise<Game> {
    // TODO check types
    const players = await Promise.all(
      newGameInput.playerIds.map((id) => this.playersService.findOneById(id)),
    );
    const game = await this.gamesService.create({ players });
    pubSub.publish('gameAdded', { gameAdded: game });
    return game;
  }
}
