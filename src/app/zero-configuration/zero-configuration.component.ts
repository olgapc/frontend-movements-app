import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { DataTablesResponse } from '../tasks/models/data-tables-response';
import { Task } from '../tasks/models/task';
import { TaskService } from '../tasks/services/task.service';

@Component({
  selector: 'app-zero-configuration',
  templateUrl: './zero-configuration.component.html',
  styleUrls: ['./zero-configuration.component.css']
})
export class ZeroConfigurationComponent implements OnInit {
  //dtOptions: DataTables.Settings = {};
  tasks: Observable<DataTablesResponse>;
  //Task[] = [];
  //dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {
  setTimeout(function(){
      $(function(){
          $('#tasks').DataTable();
      });
  }, 1000);
}

  ngOnInit(): void {
      this.tasks = this.taskService.getTasksDatatable();
      setTimeout(function(){
          $(function(){
              $('#tasks').DataTable();
          });
      }, 1000);

  }

}
