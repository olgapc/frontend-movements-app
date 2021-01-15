import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { CompanyService } from 'src/app/companies/company.service';
import { EmployeeService } from 'src/app/employees/employee.service';
import { TimeTypes } from 'src/app/enums/time-types.enum';
import { User } from 'src/app/users/models/user';
import { AuthService } from 'src/app/users/services/auth.service';
import { UserService } from 'src/app/users/services/user.service';
import Swal from 'sweetalert2';
import { Information } from '../models/information';
import { Task } from '../models/task';
import { TaskInformation } from '../models/task-information';
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
  public users: User[];
  filteredInformations: Observable<Information[]>;
  public errors: string[];


  constructor(private companyService: CompanyService,
    private employeeService: EmployeeService,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    public authService: AuthService,
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
        this.taskService.getTask(taskId).subscribe(task => {
          this.task = task;
          if(this.task.currentAssignedUser==null){
              this.task.currentAssignedUser = undefined;
          }

        });
        //console.log("task");
        //console.log(this.task);
      } else if (employeeId) {
        //console.log("employee task");
        this.employeeService.getEmployee(employeeId).subscribe(employee => this.task.employee = employee);
        this.employeeService.getEmployee(employeeId).subscribe(employee => this.task.company = employee.company);
        this.task.isMainTask = true;
        this.task.isPeriodically = false;
      } else if (companyId) {
        //console.log("company task");
        //console.log(companyId);
        this.companyService.getCompany(companyId).subscribe(company => this.task.company = company);
        this.task.isMainTask = true;

      } else if (!taskId) {
        //console.log("novatasca");
        this.task.isMainTask = true;

      }
    });
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  private _filter(value: string): Observable<Information[]> {
    const filterValue = value.toLowerCase();

    return this.taskService.filterInformations(filterValue);
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

  selectUser(value): void {
    console.log(value);
    let user = value as User;
    console.log(user);
    if (this.task.currentAssignedUser != null) {

    }

    this.task.currentAssignedUser = user;
    console.log(this.task.currentAssignedUser.username);

    console.log("authserviceuser");
    console.log(this.authService.user);

    let newUser = new User();

    this.users.forEach((user: User) => {
      if (this.authService.user.username === user.username) {
          newUser = user;
      }
    });

    this.task.currentAssignedUser.currentAssignedTasks.push(this.task);
    console.log(this.task);

  }



  showDescription(information?: Information): string | undefined {
    return information ? information.description : undefined;
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

  public informationDone(id: number, event: any): void {
    let done: boolean = event.target.checked as boolean;

    this.task.taskInformations = this.task.taskInformations.map((taskInformation: TaskInformation) => {
      if (id === taskInformation.information.id) {
        taskInformation.done = done;
        if (done) {
          taskInformation.doneAt = formatDate(Date.now(), "yyyy-MM-dd HH:mm:ss", 'ca');
          taskInformation.doneBy = this.authService.user;
        } else {
          taskInformation.doneAt = null;
          taskInformation.doneBy = null;
        }
      }
      return taskInformation;
    });

    //for (let information of this.task.taskInformations) {

    //if (information.information.id == id) {
    //if (information.done) {
    //information.doneAt = formatDate(Date.now(), "yyyy-MM-dd HH:mm:ss", 'ca');
    //}
    //else {
    //information.doneAt = null;
    //}
    //}
    //}
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
          Swal.fire('Error', `${err.error.errors}`, 'error');
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
          Swal.fire('Error', `${err.error.errors}`, 'error');
          console.error('Codi de l\'error des del backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }

  public taskDone(event: any): void {
    if (this.task.isDone) {
      this.task.doneAt = formatDate(Date.now(), "yyyy-MM-dd HH:mm:ss", 'ca');
      this.task.doneBy = this.authService.user;
    }
  }

  onIsPeriodicallyChanged(value: boolean) {
    this.task.isPeriodically = value;
  }

  updateComment(id: number, event: any): void {
    let comment: string = event.target.value as string;

    this.task.taskInformations = this.task.taskInformations.map((taskInformation: TaskInformation) => {
      if (id === taskInformation.information.id) {
        taskInformation.comment = comment;
      }
      return taskInformation;
    });

  }

  compareUser(o1: User, o2: User): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.username === o2.username;
  }
}
