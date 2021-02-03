import { CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/tasks/models/task';
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
          name: 'nou1', subtask: new Item({
            name: 'Una subtasca en general',
            children: [
              new ItemSequence({
                name: 'sub1',
                subtask: new Item({
                  name: 'SubTasca1',
                  children: [
                    new ItemSequence({
                      name: 'subsub1',
                      subtask: new Item({
                        name: 'SubtascaSub1'
                      })
                    })
                  ]
                })
              }),
              new ItemSequence({
                name: 'sub2',
                subtask: new Item({
                  name: 'SubTasca2'
                })
              }),
              new ItemSequence({
                name: 'sub3',
                subtask: new Item({
                  name: 'SubTasca3'
                })
              })
            ]
          })
        })

    )







    //name: 'Una altra subtasca en general',
    //children: [
    //new Item({ name: 'Un altre exemple de subtasca' }),
    //new Item({ name: 'Aqui un exemple de subtasca' }),
    //new Item({
    //name: 'subItem6', children: [
    //new Item({ name: 'Tenim una subtasca d\'exemple per provar' })
    //]
    //})
    //]
    //}));
    //this.parentItem.children.push(new Item({ name: 'test3' }));
    console.log(this.parentItem);
    console.log("oninit");
  }

  public onDragDrop(event: CdkDragDrop<Item>) {
    event.container.element.nativeElement.classList.remove('active');
    if (this.canBeDropped(event)) {
      const movingItem: Item = event.item.data;
      //add itemSequence to new container
      let itemSequence = new ItemSequence({ name: '', subtask: movingItem });
      event.container.data.children.push(itemSequence);
      //delete itemSequence from previousContainer
      event.previousContainer.data.children = event.previousContainer.data.children.filter((child) => child.subtask.uId !== movingItem.uId);
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

  private canBeDropped(event: CdkDragDrop<Item, Item>): boolean {
    console.log("canBeDropped");
    const movingItem: Item = event.item.data;

    return event.previousContainer.id !== event.container.id
      && this.isNotSelfDrop(event)
      && !this.hasChild(movingItem, event.container.data);
  }

  private isNotSelfDrop(event: CdkDragDrop<Item> | CdkDragEnter<Item> | CdkDragExit<Item>): boolean {
    return event.container.data.uId !== event.item.data.uId;
  }

  private hasChild(parentItem: Item, childItem: Item): boolean {
    console.log("hasChild");
    const hasChild = parentItem.children.some((item) => item.uId === childItem.uId);
    return hasChild ? true : parentItem.children.some((itemSequence) => {
      this.hasChild(itemSequence.subtask, childItem)
    });
  }

  public moveItemUp(event: CdkDragDrop<Item>){
      console.log("moveItemUp");
      console.log(event.item.data);
  }

}
