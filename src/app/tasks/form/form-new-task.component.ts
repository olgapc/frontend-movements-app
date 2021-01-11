import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { CompanyService } from 'src/app/companies/company.service';
import { EmployeeService } from 'src/app/employees/employee.service';
import { TimeTypes } from 'src/app/enums/time-types.enum';
import Swal from 'sweetalert2';
import { Information } from '../models/information';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-form-new-task',
  templateUrl: './form-new-task.component.html'
})
export class FormNewTaskComponent implements OnInit {

  title: string = 'Formulari de Tasca';
  task: Task = new Task();
  autocompleteControl = new FormControl();
  public eTimeTypes = TimeTypes;
  filteredInformations: Observable<Information[]>;
  public errors: string[];

  constructor(private companyService: CompanyService,
    private employeeService: EmployeeService,
    private taskService: TaskService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loadTask();

    this.filteredInformations = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.description),
        flatMap(value => value ? this._filter(value) : [])
      );

  }

  public loadTask(): void {

    this.activatedRoute.params.subscribe(params => {

      let taskId = +params['taskId']

      let companyId = +params['companyId']

      let employeeId = +params['employeeId']

      if (taskId) {
        this.taskService.getTask(taskId).subscribe(task => this.task = task);
        //console.log("task");
        //console.log(this.task);
      } else if (employeeId) {
        //console.log("employee task");
        this.employeeService.getEmployee(employeeId).subscribe(employee => this.task.employee = employee);
        this.employeeService.getEmployee(employeeId).subscribe(employee => this.task.company = employee.company);
        this.task.isMainTask = true;
      } else if (companyId) {
        //console.log("company task");
        //console.log(companyId);
        this.companyService.getCompany(companyId).subscribe(company => this.task.company = company);
        this.task.isMainTask = true;
    } else if (!taskId){
        //console.log("novatasca");
        this.task.isMainTask = true;
      }
    });
  }

  private _filter(value: string): Observable<Information[]> {
    const filterValue = value.toLowerCase();

    return this.taskService.uploadInformations(filterValue);
  }


  create(): void {
    console.log(this.task);
    this.taskService.create(this.task)
      .subscribe(
        //response => this.router.navigate(['/companies'])
        json => {
          this.router.navigate(['/tasks'])
          Swal.fire('Nova tasca', `${json.message}: ${json.task.description}`, 'success')
        },
        err => {
          this.errors = err.error.errors as string[];
          Swal.fire('Error', `${err.error.errors}`, 'error');
          console.error('Codi de l\'error des del backend: ' + err.status);
          console.error(err.error.errors);
        }
      );

  }






}
