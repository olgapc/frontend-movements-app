import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html'
})
export class ViewEmployeeComponent implements OnInit {

    employee: Employee;
    title: string = 'Treballador';

  constructor(private employeeService: EmployeeService,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
          let id = +params.get('id');
          this.employeeService.getEmployee(id).subscribe(employee => this.employee = employee);
      });
  }

}
