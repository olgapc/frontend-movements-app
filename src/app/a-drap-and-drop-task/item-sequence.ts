import { Item } from '../a-drap-and-drop-task/item';
import * as uuid from 'uuid';

export class ItemSequence {

        uId: string;
        name: string;
        subtask: Item;

        constructor(options: {
            name: string,
            subtask: Item
        }) {
            this.name = options.name;
            this.uId = uuid.v4();
            this.subtask = options.subtask;
        }


}
