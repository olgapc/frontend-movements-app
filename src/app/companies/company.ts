import { CompanyType } from '../company-types/company-type';
import { Employee } from '../employees/employee';
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
  employees: Employee[] = [];
}
