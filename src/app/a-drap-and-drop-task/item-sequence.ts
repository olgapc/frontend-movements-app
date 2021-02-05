import { Item } from '../a-drap-and-drop-task/item';
import * as uuid from 'uuid';

export class ItemSequence {

        uId: string;
        name: string;
        position: number;
        subtask: Item;


        constructor(options: {
            name: string,
            position: number,
            subtask: Item

        }) {
            this.name = options.name;
            this.uId = uuid.v4();
            this.position = options.position;
            this.subtask = options.subtask;
        }


}
