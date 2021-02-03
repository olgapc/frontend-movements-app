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
  @Input() parentTask?: Task;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }

  public get connectedDropListsIds(): string[] {
    return this.allDropListsIds.filter((id) => id !== this.task.id);
  }

  public allDropListsIds: string[];

  public get dragDisabled(): boolean {
      console.log ("dragDisabled");
      console.log(this.parentTask);
      console.log(!this.parentTask);
    return !this.parentTask;
  }

  public get parentTaskId(): string {
      console.log(this.parentTask.id);
      console.log("parentTaskId");
      console.log(this.dragDisabled);
    return this.dragDisabled ? '' : this.parentTask.id;

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
