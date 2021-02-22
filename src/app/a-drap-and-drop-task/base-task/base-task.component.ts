import { CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/tasks/models/task';
import { TaskService } from 'src/app/tasks/services/task.service';
import { ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';



@Component({
  selector: 'base-task',
  templateUrl: './base-task.component.html',
  styleUrls: ['./base-task.component.scss']
})
export class BaseTaskComponent implements OnInit {
  public parentItem: Task;
  public get connectedDropListsIds(): string[] {
    // We reverse ids here to respect items nesting hierarchy
    console.log("get connectedDropListsIds");
    this.sortRecursive(this.parentItem);
    return this.getIdsRecursive(this.parentItem).reverse();
  }

  constructor(private taskService: TaskService,
    //private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    //this.activatedRoute.paramMap.subscribe(params => {
    //let id = params.get('id');
    this.taskService.getTask('e3b144bc-4aab-4ec7-b1ed-120270c0e288').subscribe(task => {
      this.parentItem = task;
      console.log(this.parentItem);
    });
    //});
  }


  public onDragDrop(event: CdkDragDrop<Task>) {
    event.container.element.nativeElement.classList.remove('active');
    if (this.canBeDropped(event)) {
      const movingItem: Task = event.item.data;
      //add itemSequence to new container
      let position = event.container.data.subtasks.length;
      let itemSequenceIndex = event.previousContainer.data.subtasks.findIndex(taskSequence => taskSequence.subtask.id == movingItem.id);
      let itemSequence = event.previousContainer.data.subtasks[itemSequenceIndex];
      itemSequence.position = position;
      console.log("itemSequence");
      console.log(itemSequence);
      event.container.data.subtasks.push(itemSequence);
      //new ItemSequence({ name: '', subtask: movingItem, position });
      //event.container.data.children.push(itemSequence);
      //delete itemSequence from previousContainer
      event.previousContainer.data.subtasks = event.previousContainer.data.subtasks.filter((child) => child.id !== itemSequence.id);
      let pos = 0;
      event.previousContainer.data.subtasks.forEach((subtask)=>{
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
      console.log("moveItemInArray");
      console.log(event.container.data.subtasks);
      console.log(previousIndex);
      console.log(event.currentIndex);
    }
  }

  private getIdsRecursive(item: Task): string[] {
    let ids = [item.id];

    item.subtasks.forEach((childItem) => {

      ids = ids.concat(this.getIdsRecursive(childItem.subtask));

    });
    return ids;
  }

  private sortRecursive(item: Task) {
    item.subtasks.sort(function(a, b) {
      if (a.position > b.position) {
        return 1;
      }
      if (a.position < b.position) {
        return -1;
      }
      return 0;
    });
    item.subtasks.forEach((childItem) => {
      this.sortRecursive(childItem.subtask);
    })
  }


  private canBeDropped(event: CdkDragDrop<Task, Task>): boolean {
    console.log("canBeDropped");
    const movingItem: Task = event.item.data;
    console.log(event.previousContainer.id);
    console.log(event.container.id);
    console.log(this.isNotSelfDrop(event));
    return event.previousContainer.id !== event.container.id
      && this.isNotSelfDrop(event)
      && !this.hasChild(movingItem, event.container.data);
  }

  private isNotSelfDrop(event: CdkDragDrop<Task> | CdkDragEnter<Task> | CdkDragExit<Task>): boolean {
    return event.container.data.id !== event.item.data.id;
  }

  private hasChild(parentItem: Task, childItem: Task): boolean {
  console.log("hasChild");
  const hasChild = parentItem.subtasks.some((item) => item.subtask.id === childItem.id);
  return hasChild ? true : parentItem.subtasks.some((itemSequence) => {
  this.hasChild(itemSequence.subtask, childItem)
  });
  }



}
