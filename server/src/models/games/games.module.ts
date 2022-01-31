import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './schemas/game.schema';
import { GamesService } from './games.service';
import { GamesResolver } from './games.resolver';
import { DateScalar } from '../common/scalars/date.scalar';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    PlayersModule,
  ],
  providers: [GamesService, GamesResolver, DateScalar],
})
export class GamesModule {}
