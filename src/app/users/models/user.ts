import { UserRole } from './user-role';

export class User {
  id: number;
  username: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  userRoles: Array<UserRole>=[];
  enabled: boolean;
  createAt: string;
  comment: string;
}
