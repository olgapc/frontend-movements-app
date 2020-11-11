export class User {
  id: number;
  username: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  roles: string[] = [];
  enabled: boolean;
  createAt: string;
  comment: string;
}
