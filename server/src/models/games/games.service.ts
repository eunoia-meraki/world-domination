import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument } from './schemas/game.schema';
import { AddGameDto } from './dto/add-game.dto';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async create(addGameDto: AddGameDto): Promise<Game> {
    const createdGame = new this.gameModel(addGameDto);
    return createdGame.save();
  }

  async findAll(): Promise<Game[]> {
    return this.gameModel.find().exec();
  }

  async findOneById(id: string): Promise<Game> {
    return this.gameModel.findById(id).exec();
  }
}
