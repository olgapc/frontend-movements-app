import { MatTableDataSource } from '@angular/material/table';
import { TimeTypes } from 'src/app/enums/time-types.enum';
import { Company } from '../../companies/company';
import { Employee } from '../../employees/employee';
import { AfterBeforeTask } from './after-before-task';
import { TaskInformation } from './task-information';
import { UserAssignment } from './user-assignment';

export class Task {

  id: number;
  createAt: string;
  isToSend: boolean;
  comment: string;
  numberToCalculateDeadlineToAlarm: string;
  typeCalculationDeadline: TimeTypes;
  taskInformations?: TaskInformation[];
  beforeTasks: AfterBeforeTask[];
  afterTasks: AfterBeforeTask[];

  historicUserAssignments: UserAssignment[];

  currentUserAssignment: UserAssignment[];

  isTemplate: boolean;
  templateName: string;

  description: string;
  isDone: boolean;
  doneAt: string;
  mainTask: Task;

  isVisible: boolean;
  deadline: string;
  company: Company;
  employee: Employee;

  isMainTask: boolean;
  taskInformationsStickedToMainTask: TaskInformation[];
  subtasks?: Task[];


}
