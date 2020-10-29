import { Component, OnInit } from '@angular/core';
import { Task } from './models/task';
import { CompanyService } from '../companies/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { TaskService } from './services/task.service';
import { Information } from './models/information';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TaskInformation } from './models/task-information';
import swal from 'sweetalert2';
import { EmployeeService } from '../employees/employee.service';

@Component({
  selector: 'app-form-task',
  templateUrl: './form-task.component.html'
})
export class FormTaskComponent implements OnInit {

  title: string = 'Nova Tasca';
  task: Task = new Task();
  autocompleteControl = new FormControl();
  public errors: string[];

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
    this.activatedRoute.paramMap.subscribe(params => {
      let companyId = +params.get('companyId');
      let employeeId = +params.get('employeeId');
      if (companyId) {
        this.companyService.getCompany(companyId).subscribe(company => this.task.company = company);
      }
      if (employeeId) {
          this.employeeService.getEmployee(employeeId).subscribe(employee => this.task.employee = employee);
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
          swal.fire('Nova tasca', `${json.message}: ${json.task.description}`, 'success')
        },
        err => {
          this.errors = err.error.errors as string[];
          console.error('Codi de l\'error des del backend: ' + err.status);
          console.error(err.error.errors);
        }
      );

  }
}
