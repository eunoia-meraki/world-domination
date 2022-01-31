import { Player } from 'src/models/players/schemas/player.schema';

export class AddGameDto {
  readonly players: Player[];
}
