import * as uuid from 'uuid';
import { ItemSequence } from './item-sequence';

export class Item {
    name: string;
    uId: string;
    children: ItemSequence[];

    constructor(options: {
        name: string,
        children?: ItemSequence[]
    }) {
        this.name = options.name;
        this.uId = uuid.v4();
        this.children = options.children || [];
    }
}
