import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from 'src/app/tasks/models/task';
import { TaskSequence } from 'src/app/tasks/models/task-sequence';


@Component({
  selector: 'list-item-task',
  templateUrl: './list-item-task.component.html',
  styleUrls: ['./list-item-task.component.scss']
})
export class ListItemTaskComponent {
  @Input() item: Task;
  @Input() parentItem?: Task;
  @Input() position: number;
  @Input() length: number;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }
  public get connectedDropListsIds(): string[] {
    //console.log("get connectedDropListsIds list-item-task");
    return this.allDropListsIds.filter((id) => id !== this.item.id);
  }
  public allDropListsIds: string[];

  public get dragDisabled(): boolean {
    //console.log("get dragDisabled list-item-task");
    return !this.parentItem;
  }

  public get parentItemId(): string {
    //console.log("get parentItemId list-item-task");
    return this.dragDisabled ? '' : this.parentItem.id;
  }


  @Output() itemDrop: EventEmitter<CdkDragDrop<Task>>

  constructor() {
    this.allDropListsIds = [];
    this.itemDrop = new EventEmitter();
    //console.log("constructor list-item-task");
  }

  public onDragDrop(event: CdkDragDrop<Task, Task>): void {
    console.log("onDragDrop list-item-task");
    this.itemDrop.emit(event);
  }

  public moveItemUp() {
    console.log(this.parentItem);
    let indexToUp: number = this.parentItem.subtasks.findIndex(taskSequence => taskSequence.subtask.id == this.item.id);
    let itemSequenceToUp: TaskSequence = this.parentItem.subtasks[indexToUp];
    this.parentItem.subtasks[indexToUp].position = indexToUp - 1;
    this.parentItem.subtasks[indexToUp - 1].position = indexToUp;
    this.parentItem.subtasks[indexToUp] = this.parentItem.subtasks[indexToUp - 1];
    this.parentItem.subtasks[indexToUp - 1] = itemSequenceToUp;
    console.log(this.parentItem);
  }

  public moveItemDown() {
    console.log(this.parentItem);
    let indexToDown: number = this.parentItem.subtasks.findIndex(taskSequence => taskSequence.subtask.id == this.item.id);
    let itemSequenceToUp: TaskSequence = this.parentItem.subtasks[indexToDown];
    this.parentItem.subtasks[indexToDown].position = indexToDown + 1;
    this.parentItem.subtasks[indexToDown + 1].position = indexToDown;
    this.parentItem.subtasks[indexToDown] = this.parentItem.subtasks[indexToDown + 1];
    this.parentItem.subtasks[indexToDown + 1] = itemSequenceToUp;
    console.log(this.parentItem);
  }

}
