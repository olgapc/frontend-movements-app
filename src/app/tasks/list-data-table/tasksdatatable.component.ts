import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/users/services/auth.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TaskInformation } from '../models/task-information';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import * as $ from "jquery";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasksdatatable.component.html'
})
export class TasksdatatableComponent implements OnInit {
  @ViewChild('dataTable') table: ElementRef;
  dataTable: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title: string = 'Nova tasca';
  task: Task = new Task();
  tasks: Task[];
  numberOfTasks=0;
  tasksData: Task[] = [];
  selectedTask: Task;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;

  constructor(
    public authService: AuthService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        processing: true,
        info: true,
        language: {
          emptyTable: '',
          zeroRecords: 'No hay coincidencias',
          lengthMenu: 'Mostrar _MENU_ elementos',
          search: 'Buscar:',
          info: 'De _START_ a _END_ de _TOTAL_ elementos',
          infoEmpty: 'De 0 a 0 de 0 elementos',
          infoFiltered: '(filtrados de _MAX_ elementos totales)',
          paginate: {
            first: 'Prim.',
            last: 'Últ.',
            next: 'Sig.',
            previous: 'Ant.'
          },
        },
        ajax: (dataTablesParameters: any, callback) => {
          ////.subscribe(tasks => {
              //this.tasks = tasks;

              //callback({
                //recordsTotal: task.pagination.totalCount,
                //recordsFiltered: task.pagination.totalCount,
            //    data: []
              //});
            //console.log(this.data);
            //}
          //);
        },
        columns: [{ data: 'description' }, { data: 'deadlin' }, { data: 'createAt' }]
      };
      this.dataTable = $(this.table.nativeElement);
      this.dataTable.dataTable();



    //this.taskService.getTasks().subscribe(
      //tasks => {
        //console.log(tasks);
        //this.buildDtOptions(tasks);
        //this.dtTrigger.next();
      //})
  }

  private buildDtOptions(tasks: any): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      columns: [
        { title: 'Descripció', data: tasks },
        { title: 'Data venciment', data: tasks },
        { title: 'Data creació', data: tasks }
      ]
    };
  }



delete (task: Task): void {
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

}
