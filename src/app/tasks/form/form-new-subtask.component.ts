import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/users/models/user';
import { UserService } from 'src/app/users/services/user.service';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';
import { ModalService } from './modal.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TaskInformation } from '../models/task-information';
import { formatDate } from '@angular/common';
import { Information } from '../models/information';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/users/services/auth.service';

@Component({
  selector: 'form-new-subtask',
  templateUrl: './form-new-subtask.component.html',
  styleUrls: ['./form-new-subtask.component.css']
})
export class FormNewSubtaskComponent implements OnInit {

    @Input() task: Task;
    newTask: Task = new Task();
    public users: User[];
    autocompleteControl = new FormControl();
    selectedSubtask: Task;

  constructor(public authService: AuthService, private taskService: TaskService, private modalService: ModalService, private userService: UserService) { }

  ngOnInit(): void {
      if(this.task==null){
          this.task = this.newTask;
      }
      console.log(this.task);
      console.log(this.newTask);
      this.userService.getUsers().subscribe(users => this.users = users);
  }

  closeModal(){
      this.modalService.closeModal();
  }

  compareUser(o1: User, o2: User): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.username === o2.username;
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

  openSubtaskModal(task: Task){
      this.selectedSubtask = this.task;
      this.modalService.openModal();
  }
}
