
import { TimeTypes } from 'src/app/enums/time-types.enum';
import { User } from 'src/app/users/models/user';
import { Company } from '../../companies/company';
import { Employee } from '../../employees/employee';
import { AfterBeforeTask } from './after-before-task';
import { TaskInformation } from './task-information';


export class Task {

  id: number;
  createAt: string;
  isToSend: boolean;
  comment: string;

  typeCalculationDeadline: TimeTypes;
  taskInformations: TaskInformation[]=[];
  //beforeTasks: AfterBeforeTask[]=[];
  //afterTasks: AfterBeforeTask[]=[];
  isPeriodically: boolean;

  currentAssignedUser: User ;

  isTemplate: boolean;
  templateName: string;

  description: string;
  isDone: boolean;
  doneAt: string;
  doneBy: User;
  mainTask: Task;

  isVisible: boolean;
  deadline: string;
  company: Company;
  employee: Employee;

  isMainTask: boolean;
  taskInformationsStickedToMainTask: TaskInformation[]=[];
  subtasks: Task[]=[];

  numberToCalculateDeadline: string;
}
