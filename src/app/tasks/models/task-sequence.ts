import { Task } from './task';

export class TaskSequence {

    id: number;
    createAt: string;
    subtask: Task;
    comment: string;
    position: number;

    pretask: Task;
}
