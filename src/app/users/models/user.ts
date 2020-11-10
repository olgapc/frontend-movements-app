export class User {
  id: number;
  username: string;
  name: string;
  email: string;
  lastName: string;
  password: string;
  roles: string[] = [];
  enabled: boolean;
  createAt: string;
}
