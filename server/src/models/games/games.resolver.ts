import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { UsersService } from '../users/users.service';
import { AddGameInput } from './dto/add-game.input';
import { GamesService } from './games.service';
import { Game } from './schemas/game.schema';

const pubSub = new PubSub();

@UseGuards(JwtAuthGuard)
@Resolver(() => Game)
export class GamesResolver {
  constructor(
    private readonly gamesService: GamesService,
    private readonly usersService: UsersService,
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
  async addGame(@Args('input') input: AddGameInput): Promise<Game> {
    const users = await Promise.all(
      input.userIds.map((id) => this.usersService.findOneById(id)),
    );
    const game = await this.gamesService.create({ users });
    pubSub.publish('gameAdded', { gameAdded: game });
    return game;
  }
}
