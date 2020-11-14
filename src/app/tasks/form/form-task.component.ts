import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { TaskService } from '../services/task.service';
import { Information } from '../models/information';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TaskInformation } from '../models/task-information';
import Swal from 'sweetalert2';
import { DatePipe, formatDate } from '@angular/common';
import { TimeTypes } from 'src/app/enums/time-types.enum';
import { CompanyService } from 'src/app/companies/company.service';
import { EmployeeService } from 'src/app/employees/employee.service';

@Component({
  selector: 'app-form-task',
  templateUrl: './form-task.component.html'
})
export class FormTaskComponent implements OnInit {

  title: string = 'Formulari de Tasca';
  task: Task = new Task();
  autocompleteControl = new FormControl();
  public errors: string[];
  public eTimeTypes = TimeTypes;
  public doneAt: Date;

  filteredInformations: Observable<Information[]>;

  constructor(private companyService: CompanyService,
    private employeeService: EmployeeService,
    private taskService: TaskService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadTask();

    this.filteredInformations = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.description),
        flatMap(value => value ? this._filter(value) : [])
      );

  }

  public loadTask(): void {

    this.activatedRoute.params.subscribe(params => {

      let taskId = +params['idTask']

      let companyId = +params['idCompany']

      let employeeId = +params['idEmployee']

      if (taskId) {
        this.taskService.getTask(taskId).subscribe(task => this.task = task);
        console.log("task");
        console.log(this.task);
      } else if (employeeId) {
        console.log("employee task");
        this.employeeService.getEmployee(employeeId).subscribe(employee => this.task.employee = employee);
        this.employeeService.getEmployee(employeeId).subscribe(employee => this.task.company = employee.company);
      } else if (companyId) {
        console.log("company task");
        this.companyService.getCompany(companyId).subscribe(company => this.task.company = company);
      }
    });
  }

  private _filter(value: string): Observable<Information[]> {
    const filterValue = value.toLowerCase();

    return this.taskService.uploadInformations(filterValue);
  }

  showDescription(information?: Information): string | undefined {
    return information ? information.description : undefined;
  }

  selectInformation(event: MatAutocompleteSelectedEvent): void {
    let information = event.option.value as Information;
    console.log(information);

    if (!this.informationExists(information.id)) {

      let newInformation = new TaskInformation();

      newInformation.information = information;
      this.task.taskInformations.push(newInformation);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();

  }

  informationExists(id: number): boolean {
    let exists = false;

    this.task.taskInformations.forEach((information: TaskInformation) => {
      if (id === information.information.id) {
        exists = true;
      }
    });
    return exists;
  }

  deleteTaskInformation(id: number): void {
    this.task.taskInformations = this.task.taskInformations.filter((taskInformation: TaskInformation) => id != taskInformation.information.id);
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
          console.error('Codi de l\'error des del backend: ' + err.status);
          console.error(err.error.errors);
        }
      );

  }


  public update(): void {
    console.log(this.task);
    this.taskService.update(this.task)
      .subscribe(
        json => {
          this.router.navigate(['/tasks'])
          Swal.fire('Tasca actualitzada', `${json.message}: ${json.task.description}`, 'success')

        },
        err => {
          this.errors = err.error.errors as string[];
          console.error('Codi de l\'error des del backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }

  public taskDone(event: any): void {
    if (this.task.isDone) {
      this.task.doneAt = formatDate(Date.now(), "yyyy-MM-dd HH:mm:ss", 'ca');

    }
  }

  public informationDone(id: number, $event): void {
    for (let information of this.task.taskInformations) {

      if (information.information.id == id) {
        if (information.done) {
          information.doneAt = formatDate(Date.now(), "yyyy-MM-dd HH:mm:ss", 'ca');
        }
        else {
            information.doneAt = null;
        }
      }
    }
  }
}
