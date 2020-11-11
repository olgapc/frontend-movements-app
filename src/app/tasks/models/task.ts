import { TimeTypes } from 'src/app/enums/time-types.enum';
import { Company } from '../../companies/company';
import { Employee } from '../../employees/employee';
import { TaskInformation } from './task-information';

export class Task {
  id: number;
  description: string;
  isOptionalSubtask: boolean;
  isToSend: boolean;
  isTemplate: boolean;
  templateName: string;
  numberToCalculateDeadlineToAlarm: string;
  typeCalculationDeadline: TimeTypes;
  deadline: string;
  createAt: string;
  company: Company;
  employee: Employee;
  taskInformations: Array<TaskInformation>=[];
  isDone: boolean;
  doneAt: string;
  mainTask: Task;
  subtasks: Task[]=[];
  isMainTask: boolean;
  comment: string;
}
