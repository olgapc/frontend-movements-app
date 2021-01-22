import { Task } from './task';

export class TaskSequence {

    id: number;
    createAt: string;
    subtask: Task;
    pretask: Task;
    comment: string;
}
