import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import { Task } from './models/task';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html'
})
export class ViewTaskComponent implements OnInit {

  task: Task;
  title: string = 'Tasca';

  constructor(private taskService: TaskService,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      this.taskService.getTask(id).subscribe(task => this.task = task);
    });
  }

}
