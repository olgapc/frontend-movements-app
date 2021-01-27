import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../models/task';
import { TaskSequence } from '../models/task-sequence';

@Component({
  selector: 'subtasks-list',
  templateUrl: './subtasks-list.component.html',
  styleUrls: ['./subtasks-list.component.scss']
})
export class SubtasksListComponent implements OnInit{
  @Input() task: Task;
  @Input() parentItem?: Task;
  @Input() public set connectedDropListsIds(ids: number[]) {
    this.allDropListsIds = ids;
  }

  public get connectedDropListsIds(): number[] {
    return this.allDropListsIds.filter((id) => id !== this.task.id);
  }

  public allDropListsIds: number[];

  public get dragDisabled(): boolean {
      console.log ("dragDisabled");
      console.log(this.parentItem);
      console.log(!this.parentItem);
    return !this.parentItem;
  }

  public get parentItemId(): number {
      console.log(this.parentItem.id);
      console.log("parentItemId");
      console.log(this.dragDisabled);
    return this.dragDisabled ? null : this.parentItem.id;

  }


  @Output() itemDrop: EventEmitter<CdkDragDrop<Task>>

  constructor() {
    this.allDropListsIds = [];
    this.itemDrop = new EventEmitter();
  }

  ngOnInit() {}

  public onDragDrop(event: CdkDragDrop<Task, Task>): void {
    this.itemDrop.emit(event);
  }

}
