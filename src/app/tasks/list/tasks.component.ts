import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/users/services/auth.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TaskInformation } from '../models/task-information';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tasks',
  styleUrls: ['tasks.component.css'],
  templateUrl: './tasks.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ],
})
export class TasksComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChildren('innerSort1') innerSort1: QueryList<MatSort>;
  @ViewChildren('innerTables1') innerTables1: QueryList<MatTable<TaskInformation>>;
  @ViewChildren('innerSort2') innerSort2: QueryList<MatSort>;
  @ViewChildren('innerTables2') innerTables2: QueryList<MatTable<Task>>;


  title: string = 'Nova tasca';
  task: Task = new Task();
  tasks: Task[];
  tasksData: Task[] = [];
  //paginator: any;
  linkPaginator: string = '/tasks';
  public errors: string[];

  today: Date = new Date();

  displayedColumns = ['subtasks', 'description', 'deadline', 'createAt', 'taskInformations', 'options'];
  innerDisplayedColumns = ['description', 'deadline', 'createAt', 'options'];
  innerInformationsDisplayedColumns = ['description', 'comment', 'done']
  dataSource: MatTableDataSource<any[]>;
  expandedElementSubtask: Task | null;
  expandedElementInformation: Task | null;

  //taskInformations: TaskInformation[];


  constructor(
    public authService: AuthService,
    private taskService: TaskService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.taskService.getTasks().subscribe(
      tasks => {
        this.tasks = tasks;
        this.tasks.forEach(task => {
          if (task.subtasks && Array.isArray(task.subtasks) && task.subtasks.length) {

            if (task.taskInformations && Array.isArray(task.taskInformations) && task.taskInformations.length) {
              this.tasksData = [...this.tasksData, { ...task, subtasks: new MatTableDataSource(task.subtasks), taskInformations: new MatTableDataSource(task.taskInformations) }];
              //console.log(task);
            } else {
              this.tasksData = [...this.tasksData, { ...task, subtasks: new MatTableDataSource(task.subtasks) }];
            }
          } else if (task.taskInformations && Array.isArray(task.taskInformations) && task.taskInformations.length) {
            this.tasksData = [...this.tasksData, { ...task, taskInformations: new MatTableDataSource(task.taskInformations) }];
          } else {
            this.tasksData = [...this.tasksData, task];
          }
          console.log(task.deadline);
        });
        this.dataSource = new MatTableDataSource(this.tasksData);
        console.log(this.dataSource);
        console.log(this.today);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
    //this.activatedRoute.paramMap.subscribe(params => {
    //let page: number = +params.get('page');

    //if (!page) {
    //page = 0;
    //}

    //this.taskService.getTasks()
    //.subscribe(response => {
    //this.dataSource.data = response.content as Task[];
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
    //this.tasks = response.content as Task[];
    //this.paginator = response;
    //})
    //}

    //);

  }

  expandRowInformation(element: Task) {
    try {
      if ((element.taskInformations as MatTableDataSource<TaskInformation>).data.length > 0) {
        console.log(this.expandedElementInformation);
        element.subtasks && (element.taskInformations as MatTableDataSource<TaskInformation>).data.length ? (this.expandedElementInformation = this.expandedElementInformation === element ? null : element) : null;
        console.log("expandedElement2");
        console.log(this.expandedElementInformation);
        this.cd.detectChanges();
        this.innerTables1.forEach((table, index) => (table.dataSource as MatTableDataSource<TaskInformation>).sort = this.innerSort1.toArray()[index]);
      }
    } catch (error) {
    }
  }


  expandRowSubtask(element: Task) {
    //console.log(element.subtasks ==null);
    //console.log((element.subtasks as MatTableDataSource<Task>).data.length>0);
    try {
      if ((element.subtasks as MatTableDataSource<Task>).data.length > 0) {
        console.log(this.expandedElementSubtask);
        element.subtasks && (element.subtasks as MatTableDataSource<Task>).data.length ? (this.expandedElementSubtask = this.expandedElementSubtask === element ? null : element) : null;
        console.log(this.expandedElementSubtask);
        this.cd.detectChanges();
        this.innerTables2.forEach((table, index) => (table.dataSource as MatTableDataSource<Task>).sort = this.innerSort2.toArray()[index]);
      }
    } catch (error) {
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyInnerFilter1(filterValue: string) {
    this.innerTables1.forEach((table, index) => (table.dataSource as MatTableDataSource<TaskInformation>).filter = filterValue.trim().toLowerCase());
  }

  applyInnerFilter2(filterValue: string) {
    this.innerTables2.forEach((table, index) => (table.dataSource as MatTableDataSource<Task>).filter = filterValue.trim().toLowerCase());
  }


  delete(task: Task): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-info',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Segur?',
      text: `Vols eliminar la tasca ${task.description}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, esborra!',
      cancelButtonText: 'No, cancela',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.taskService.delete(task.id).subscribe(
          () => {
            this.tasks = this.tasks.filter(ta => ta !== task)
            swalWithBootstrapButtons.fire(
              'Tasca eliminada!',
              `Tasca ${task.description} eliminada amb èxit.`,
              'success'
            )
          }
        )
      }
    })
  }

  getStatus(deadline: string): string {

    let newDate = new Date(deadline + 'T00:00:00Z');
    let today = new Date(Date.UTC(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()));

    console.log(newDate);
    console.log(today);
    if (newDate.getTime() == today.getTime()) {
      console.log("ispresent");
      return "is-present";
    } else if (newDate.getTime() < this.today.getTime()) {

      return "is-past";
    } else { return "is-future"; }

  }


}
