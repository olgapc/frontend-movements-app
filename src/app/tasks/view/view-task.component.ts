import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html'
})
export class ViewTaskComponent implements OnInit {

  task: Task;
  title: string = 'Tasca';

  //SUBTASKS
  public parentTask: Task;

  public get connectedDropListsIds(): string[] {
    this.sortRecursive(this.parentTask);
    //we reverse ids here to respect items nesting hierarchy
    return this.getIdsRecursive(this.parentTask).reverse();
  }

  constructor(private taskService: TaskService,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      this.taskService.getTask(id).subscribe(task => {
          this.task = task;
          this.parentTask = task});
    });
  }

  //methods for subtasks
  public onDragDrop(event: CdkDragDrop<Task>) {
    event.container.element.nativeElement.classList.remove('active');
    if (this.canBeDropped(event)) {
      const movingTask: Task = event.item.data;
      let position = event.container.data.subtasks.length;
      let taskSequenceIndex = event.previousContainer.data.subtasks.findIndex(taskSequence => taskSequence.subtask.id == movingTask.id);
      let taskSequence = event.previousContainer.data.subtasks[taskSequenceIndex];
      taskSequence.position = position;
      event.container.data.subtasks.push(taskSequence);
      event.previousContainer.data.subtasks = event.previousContainer.data.subtasks.filter((child) => child.id !== taskSequence.id);
      let pos = 0;
      event.previousContainer.data.subtasks.forEach((subtask) => {
          subtask.position = pos;
          pos = pos+1;
      })
    } else {
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
      && this.isNotSelfDrop(event);
      //&& !this.hasChild(movingTask, event.container.data);
  }

  private isNotSelfDrop(event: CdkDragDrop<Task> | CdkDragEnter<Task> | CdkDragExit<Task>): boolean {
    return event.container.data.id !== event.item.data.id;
  }

}
