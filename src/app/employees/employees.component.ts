import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { AuthService } from '../users/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html'
})
export class EmployeesComponent implements OnInit {

  employees: Employee[];
  selectedEmployee: Employee;
  paginator: any;
  linkPaginator: string = '/employees/page';


  constructor(private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.employeeService.getEmployees(page)
        .subscribe(
          response => {
            this.employees = response.content as Employee[];
            this.paginator = response;
        });
    }
    );
  }

}
