import { Company } from '../../companies/company';
import { Employee } from '../../employees/employee';
import { TaskInformation } from './task-information';

export class Task {
  id: number;
  description: string;
  optionalSubtask: boolean;
  toSend: boolean;
  template: boolean;
  nameTemplate: string;
  numberToCalculateDeadlineToAlarm: string;
  typeCalculationDeadline: string;
  deadline: string;
  createAt: string;
  company: Company;
  employee: Employee;
  taskInformations: Array<TaskInformation>=[];
  done: boolean;
  doneAt: string;
  mainTask: Task;
  subtasks: Task[]=[];
  taskMain: boolean;
}
