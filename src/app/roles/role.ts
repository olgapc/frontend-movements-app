import { User } from '../users/models/user';

export class Role {
  id: number;
  description: string;
  role: string;
  users: User[] = [];
  createAt: string;
}
