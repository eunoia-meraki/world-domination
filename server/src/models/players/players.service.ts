import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Player, PlayerDocument } from './schemas/player.schema';
import { AddPlayerDto } from './dto/add-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
  ) {}

  async create(addPlayerDto: AddPlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(addPlayerDto);
    return createdPlayer.save();
  }

  async findAll(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  async findOneById(id: string): Promise<Player> {
    return this.playerModel.findById(id).exec();
  }
}
