import { CompanyType } from '../company-types/company-type';
import { Task } from '../tasks/models/task';

export class Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  createAt: string;
  companyType: CompanyType;
  image: string;
  tasks: Task[] = [];
}
