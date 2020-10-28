import { Company } from '../companies/company';
import { NifType } from '../nif-types/nif-type';
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
  gender: string;
  isEnabled: boolean;
  comment: string;
  createAt: string;
  tasks: Task[] = [];
  company: Company;
}
