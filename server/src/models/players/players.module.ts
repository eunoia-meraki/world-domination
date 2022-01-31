import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './schemas/player.schema';
import { PlayersService } from './players.service';
import { DateScalar } from '../common/scalars/date.scalar';
import { PlayersResolver } from './players.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  providers: [PlayersService, PlayersResolver, DateScalar],
  exports: [PlayersService],
})
export class PlayersModule {}
