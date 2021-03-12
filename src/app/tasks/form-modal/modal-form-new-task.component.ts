import { formatDate } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
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
import { ModalService } from './modal.service';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskSequence } from '../models/task-sequence';


@Component({
  selector: 'modal-form-new-task',
  templateUrl: './modal-form-new-task.component.html',
  styleUrls: ['./modal-form-new-task.component.css']
})
export class ModalFormNewTaskComponent implements OnInit {

  title: string = 'Formulari de Tasca Modal';
  @Input() task: Task;
  //task: Task = new Task();
  autocompleteControl = new FormControl();
  public eTimeTypes = TimeTypes;
  public users: User[];
  filteredInformations: Observable<Information[]>;
  public errors: string[];
  //selectedSubtask: Task;

  //SUBTASKS
  public parentTask: Task;

  public get connectedDropListsIds(): string[] {
    //console.log(this.task);
    this.sortRecursive(this.task);
    //we reverse ids here to respect items nesting hierarchy
    return this.getIdsRecursive(this.task).reverse();
  }

  constructor(private companyService: CompanyService,
    private employeeService: EmployeeService,
    private modalService: ModalService,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    public authService: AuthService,
) { }

  ngOnInit() {

    // console.log(this.task1);
    //console.log(this.task);
    //this.taskService.getTask(this.task1.id).subscribe(task => {
    //this.task = task;
    //this.parentTask = task;
    //if (this.task.currentAssignedUser == null) {
    //this.task.currentAssignedUser = undefined;
    //}

    //});

    //this.loadTask();

    this.filteredInformations = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.description),
        flatMap(value => value ? this._filter(value) : [])
      );

    /* this.modalService.notifyUpload.subscribe(
       task => {
         this.task.subtasks = this.task.subtasks.map(modalSubtask => {
             if (company.id == originalCompany.id) {
               originalCompany.image = company.image;
             }
             return originalCompany;
           })
       })*/

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

  //methods for subtasks
  public onDragDrop(event: CdkDragDrop<Task>) {
    event.container.element.nativeElement.classList.remove('active');
    if (this.canBeDropped(event)) {

      const movingTask: Task = event.item.data;
      let position = event.container.data.subtasks.length;
      let taskSequenceIndex = event.previousContainer.data.subtasks.findIndex(taskSequence => taskSequence.subtask.id == movingTask.id);
      let taskSequence = event.previousContainer.data.subtasks[taskSequenceIndex];
      //taskSequence.subtask.mainTask = event.container.data;
      taskSequence.subtask.isMainTask = false;
      taskSequence.position = position;
      console.log(taskSequence);
      event.container.data.subtasks.push(taskSequence);
      console.log(event.container.data);
      event.previousContainer.data.subtasks = event.previousContainer.data.subtasks.filter((child) => child.id !== taskSequence.id);

    } else {
      console.log("can't be dropped");
      const previousIndex = event.container.data.subtasks.findIndex(element => element.subtask.id === event.item.data.id);
      moveItemInArray(
        event.container.data.subtasks,
        previousIndex,
        event.currentIndex
      );
    }
  }

  private getIdsRecursive(task: Task): string[] {
    let ids = [task.id];

    task.subtasks.forEach((subtask) => {
      ids = ids.concat(this.getIdsRecursive(subtask.subtask));
    });

    return ids;
  }

  private sortRecursive(task: Task) {
    task.subtasks.sort(function(a, b) {
      if (a.position > b.position) {
        return 1;
      }
      if (a.position < b.position) {
        return -1;
      }
      return 0;
    });
    task.subtasks.forEach((subtask) => {
      this.sortRecursive(subtask.subtask);
    })
  }


  private canBeDropped(event: CdkDragDrop<Task, Task>): boolean {
    const movingTask: Task = event.item.data;

    return event.previousContainer.id !== event.container.id
      && this.isNotSelfDrop(event)
      && !this.hasChild(movingTask, event.container.data);
  }

  private isNotSelfDrop(event: CdkDragDrop<Task> | CdkDragEnter<Task> | CdkDragExit<Task>): boolean {
    return event.container.data.id !== event.item.data.id;
  }

  private hasChild(parentTask: Task, childItem: Task): boolean {
    console.log("hasChild");
    const hasChild = parentTask.subtasks.some((taskSequence) =>
      taskSequence.subtask.id === childItem.id
    );

    return hasChild ? true : parentTask.subtasks.some((taskSequence) => this.hasChild(taskSequence.subtask, childItem));
  }

  //openSubtaskModal(task: Task){
  //  this.selectedSubtask = this.task;
  //this.subtaskModalService.openModal();
  //}

  closeModal(){
    this.modalService.closeModal();
  }

  /*openSubtaskModal(task: Task){
      let newTask: Task;
      newTask.isMainTask = false;
      newTask.createAt = formatDate(Date.now(), "yyyy-MM-dd HH:mm:ss", 'ca');

      //al guardar
      let newTaskSequence: TaskSequence;
      newTaskSequence.subtask = newTask;
      task.subtasks.push(newTaskSequence);
  }*/
}
