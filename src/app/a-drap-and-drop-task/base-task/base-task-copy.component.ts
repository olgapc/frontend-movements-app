import { CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Item } from '../item';

import { ItemSequence } from '../item-sequence';

@Component({
  selector: 'base-task',
  templateUrl: './base-task.component.html',
  styleUrls: ['./base-task.component.scss']
})
export class BaseTaskComponent implements OnInit {
  public parentItem: Item;
  public get connectedDropListsIds(): string[] {
    // We reverse ids here to respect items nesting hierarchy
    console.log("get connectedDropListsIds");
    this.sortRecursive(this.parentItem);
    return this.getIdsRecursive(this.parentItem).reverse();
  }

  constructor() {
    this.parentItem = new Item({ name: 'TASCA PARE' });
    console.log("constructor");
  }

  public ngOnInit() {
    this.parentItem.children.push(
      new ItemSequence(
        {
          name: 'nou1', position: 0, subtask: new Item({
            name: 'Una subtasca en general',
            children: [
              new ItemSequence({
                name: 'sub1', position: 0,
                subtask: new Item({
                  name: 'SubTasca1',
                  children: [
                    new ItemSequence({
                      name: 'subsub1',
                      position: 0,
                      subtask: new Item({
                        name: 'SubtascaSub1'
                      })
                    })
                  ]
                })
              }),
              new ItemSequence({
                name: 'sub3',
                position: 2,
                subtask: new Item({
                  name: 'SubTasca3'
                })
              }),
              new ItemSequence({
                name: 'sub2',
                position: 1,
                subtask: new Item({
                  name: 'SubTasca2'
                })
              })
            ]
          })
        })

    )

    console.log(this.parentItem);
    console.log("oninit");
  }

  public onDragDrop(event: CdkDragDrop<Item>) {
    event.container.element.nativeElement.classList.remove('active');
    if (this.canBeDropped(event)) {
      const movingItem: Item = event.item.data;
      //add itemSequence to new container
      let position = event.container.data.children.length;
      let itemSequenceIndex = event.previousContainer.data.children.findIndex(taskSequence => taskSequence.subtask.uId == movingItem.uId);
      let itemSequence = event.previousContainer.data.children[itemSequenceIndex];
      itemSequence.position = position;
      event.container.data.children.push(itemSequence);
      //new ItemSequence({ name: '', subtask: movingItem, position });
      //event.container.data.children.push(itemSequence);
      //delete itemSequence from previousContainer
      event.previousContainer.data.children = event.previousContainer.data.children.filter((child) => child.uId !== itemSequence.uId);
    } else {
      const previousIndex = event.container.data.children.findIndex(element => element.subtask.uId === event.item.data.uId);

      moveItemInArray(
        event.container.data.children,
        previousIndex,
        event.currentIndex
      );
      console.log("moveItemInArray");
      console.log(event.container.data.children);
      console.log(previousIndex);
      console.log(event.currentIndex);
    }
  }

  private getIdsRecursive(item: Item): string[] {
    let ids = [item.uId];

    item.children.forEach((childItem) => {

      ids = ids.concat(this.getIdsRecursive(childItem.subtask));

    });

    return ids;
  }

  private sortRecursive(item: Item) {
    item.children.sort(function(a, b) {
      if (a.position > b.position) {
        return 1;
      }
      if (a.position < b.position) {
        return -1;
      }
      return 0;
    });
    item.children.forEach((childItem) => {
      this.sortRecursive(childItem.subtask);
    })
  }


  private canBeDropped(event: CdkDragDrop<Item, Item>): boolean {
    console.log("canBeDropped");
    const movingItem: Item = event.item.data;

    return event.previousContainer.id !== event.container.id
      && this.isNotSelfDrop(event);
      //&& !this.hasChild(movingItem, event.container.data);
  }

  private isNotSelfDrop(event: CdkDragDrop<Item> | CdkDragEnter<Item> | CdkDragExit<Item>): boolean {
    return event.container.data.uId !== event.item.data.uId;
  }

  //private hasChild(parentItem: Item, childItem: Item): boolean {
    //console.log("hasChild");
    //const hasChild = parentItem.children.some((item) => item.uId === childItem.uId);
    //return hasChild ? true : parentItem.children.some((itemSequence) => {
      //this.hasChild(itemSequence.subtask, childItem)
    //});
  //}



}
