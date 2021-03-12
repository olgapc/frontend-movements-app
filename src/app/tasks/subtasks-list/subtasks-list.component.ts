import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../models/task';
import { TaskSequence } from '../models/task-sequence';
import { ModalService } from '../form/modal.service';

@Component({
  selector: 'subtasks-list',
  templateUrl: './subtasks-list.component.html',
  styleUrls: ['./subtasks-list.component.scss']
})
export class SubtasksListComponent {
  @Input() task: Task;
  @Input() parentTask?: Task;
  @Input() position: number;
  @Input() length: number;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }
  selectedSubtask: Task;

  public get connectedDropListsIds(): string[] {
    return this.allDropListsIds.filter((id) => id !== this.task.id);
  }

  public allDropListsIds: string[];

  public get dragDisabled(): boolean {
    return !this.parentTask;
  }

  public get parentTaskId(): string {
    return this.dragDisabled ? '' : this.parentTask.id;

  }


  @Output() itemDrop: EventEmitter<CdkDragDrop<Task>>

  constructor( private modalService: ModalService) {
    this.allDropListsIds = [];
    this.itemDrop = new EventEmitter();
  }

  public onDragDrop(event: CdkDragDrop<Task, Task>): void {
    this.itemDrop.emit(event);
  }

  public moveTaskUp(){
      let indexToUp: number = this.parentTask.subtasks.findIndex(taskSequence => taskSequence.subtask.id == this.task.id);
      let itemSequenceToUp: TaskSequence = this.parentTask.subtasks[indexToUp];
      this.parentTask.subtasks[indexToUp].position = indexToUp-1;
      this.parentTask.subtasks[indexToUp-1].position = indexToUp;
      this.parentTask.subtasks[indexToUp]= this.parentTask.subtasks[indexToUp-1];
      this.parentTask.subtasks[indexToUp-1]= itemSequenceToUp;
      console.log(this.parentTask);
  }


  public moveTaskUpDown(){
      let indexToDown: number = this.parentTask.subtasks.findIndex(taskSequence => taskSequence.subtask.id == this.task.id);
      let itemSequenceToUp: TaskSequence = this.parentTask.subtasks[indexToDown];
      this.parentTask.subtasks[indexToDown].position = indexToDown+1;
      this.parentTask.subtasks[indexToDown+1].position = indexToDown;
      this.parentTask.subtasks[indexToDown]= this.parentTask.subtasks[indexToDown+1];
      this.parentTask.subtasks[indexToDown+1]= itemSequenceToUp;
      console.log(this.parentTask);
  }


  openSubtaskModal(task: Task){
      this.selectedSubtask = task;
      this.modalService.openModal();
  }
}
