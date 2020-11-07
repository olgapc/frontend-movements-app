import { Company } from '../companies/company';
import { Gender } from '../enums/gender.enum';
import { NifType } from '../enums/nif-types.enum';
import { Task } from '../tasks/models/task';

export class Employee {

  id: number;
  name: string;
  nif: string;
  nifType: NifType;
  naf: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  isEnabled: boolean;
  comment: string;
  createAt: string;
  tasks: Task[] = [];
  company: Company;
}
