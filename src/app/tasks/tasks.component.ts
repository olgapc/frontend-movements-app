import { Component, OnInit } from '@angular/core';
import { Task } from './models/task';
import { TaskService } from './services/task.service';
import { CompanyService } from '../companies/company.service';
import { EmployeeService } from '../employees/employee.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  title:string = 'Nova tasca';
  task: Task = new Task();
  tasks: Task[];

  constructor(private activatedRoute: ActivatedRoute,
    private taskService: TaskService
    ) { }

  ngOnInit(): void {
    this.taskService.getTasks().pipe(
      tap(tasks => {
        console.log('TasksComponent: tap 3')
        tasks.forEach(t => {
          console.log(t.description);
        });
      })
    ).subscribe(
      tasks => this.tasks = tasks
      //is the same than: function (companies) {this.companies = companies}
    );

  }

}
