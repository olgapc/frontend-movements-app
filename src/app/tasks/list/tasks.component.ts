import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/users/auth.service';


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

}
