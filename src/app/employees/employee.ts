import { Task } from '../tasks/models/task';

export class Employee {

  id: number;
  name: string;
  nif: string;
  typeNif: string;
  naf: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  enable: boolean;
  comment: string;
  createAt: string;
  tasks: Task[] = [];
}
