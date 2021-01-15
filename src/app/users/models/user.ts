import { Task } from 'src/app/tasks/models/task';
import { UserRole } from './user-role';

export class User {
  id: number;
  username: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  userRoles: Array<UserRole>=[];
  isEnabled: boolean;
  createAt: string;
  comment: string;
  currentAssignedTasks: Task[];
}
