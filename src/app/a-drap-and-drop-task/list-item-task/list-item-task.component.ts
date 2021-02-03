import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../item';
import { ItemSequence } from '../item-sequence';


@Component({
  selector: 'list-item-task',
  templateUrl: './list-item-task.component.html',
  styleUrls: ['./list-item-task.component.scss']
})
export class ListItemTaskComponent {
  @Input() item: Item;
  @Input() parentItem?: Item;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }
  public get connectedDropListsIds(): string[] {
      //console.log("get connectedDropListsIds list-item-task");
    return this.allDropListsIds.filter((id) => id !== this.item.uId);
  }
  public allDropListsIds: string[];

  public get dragDisabled(): boolean {
      //console.log("get dragDisabled list-item-task");
    return !this.parentItem;
  }

  public get parentItemId(): string {
      //console.log("get parentItemId list-item-task");
    return this.dragDisabled ? '' : this.parentItem.uId;
  }


  @Output() itemDrop: EventEmitter<CdkDragDrop<Item>>

  constructor() {
    this.allDropListsIds = [];
    this.itemDrop = new EventEmitter();
    //console.log("constructor list-item-task");
  }

  public onDragDrop(event: CdkDragDrop<Item, Item>): void {
      //console.log("onDragDrop list-item-task");
    this.itemDrop.emit(event);
  }

  public moveItemUp(): void {
    console.log(event.data);
    console.log(item);
  }


}
