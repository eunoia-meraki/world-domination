import { User } from 'src/models/users/schemas/user.schema';

export class AddGameDto {
  readonly users: User[];
}
