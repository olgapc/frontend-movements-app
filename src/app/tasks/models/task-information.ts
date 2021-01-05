import { User } from 'src/app/users/models/user';
import { Information } from './information';

export class TaskInformation {
  id: number;
  information: Information;
  comment: string;
  createAt: string;
  done: boolean;
  doneAt: string;
  doneBy: User;         
  isSticked: boolean;
}
