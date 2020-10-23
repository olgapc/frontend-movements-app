import { Component, OnInit } from '@angular/core';
import { Task } from './models/task';
import { TaskService } from './services/task.service';
import { CompanyService } from '../companies/company.service';
import { EmployeeService } from '../employees/employee.service';
import { AuthService } from '../users/auth.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {

  title: string = 'Nova tasca';
  task: Task = new Task();
  tasks: Task[];
  paginator: any;
  linkPaginator: string = '/tasks/page';

  constructor(private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.taskService.getTasks(page)
        .subscribe(response => {
          this.tasks = response.content as Task[];
          this.paginator = response;
        })
    }

    );

  }

}
