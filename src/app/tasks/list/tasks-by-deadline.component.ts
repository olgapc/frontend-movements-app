import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/users/services/auth.service';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-tasks-by-deadline',
  templateUrl: './tasks-by-deadline.component.html'
})
export class TasksByDeadlineComponent implements OnInit {

    //@ViewChild(MatAccordion) accordion: MatAccordion;

    tasks: Task[];
    selectedTask: Task;



  constructor(private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    public authService: AuthService) { }

  ngOnInit(): void {
      this.taskService.getTasks().subscribe(
          tasks => this.tasks = tasks
      );
  }

}
