import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Task } from '../models/task';
import { formatDate } from '@angular/common';
import { catchError, map } from 'rxjs/operators';
import { Information } from '../models/information';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private urlEndPoint: string = 'http://localhost:8090/api/tasks';

  constructor(private http: HttpClient, private router: Router) { }

  getTasks(page:number): Observable<any>{
    //return this.http.get<Task[]>(this.urlEndPoint);

    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(

      map ((response:any) => {

        (response.content as Task []).map(task => {
          task.description = task.description.toUpperCase();
          task.createAt = formatDate(task.createAt, 'EEE dd-MM-yyyy hh:mm', 'ca');
          task.deadline = formatDate(task.deadline, 'EEE dd-MM-yyyy', 'ca');
          return task;
        });
        return response;
      }),
    );
  }

  getTask(id:number):Observable<Task>{
    return this.http.get<Task>(`${this.urlEndPoint}/${id}`).pipe(
        catchError(e => {
          if (e.status != 401 && e.error.message) {
            this.router.navigate(['/employees']);
            console.error(e.error.message);
          }

          return throwError(e);
      }),

        map (task => {
                task.description = task.description.toUpperCase();
                task.createAt = formatDate(task.createAt, 'EEE dd-MM-yyyy', 'ca');
                task.deadline = formatDate(task.deadline, 'EEE dd-MM-yyyy', 'ca');
                task.taskInformations.forEach(taskInformation => {
                    taskInformation.information.description = taskInformation.information.description.toUpperCase();
                    taskInformation.createAt = formatDate(taskInformation.createAt, 'EEE dd-MM-yyyy', 'ca');
                })
                task.subtasks.forEach(subtask => {
                    subtask.description = subtask.description.toUpperCase();
                    subtask.createAt = formatDate(subtask.createAt, 'EEE dd-MM-yyyy', 'ca');
                    subtask.deadline = formatDate(subtask.deadline, 'EEE dd-MM-yyyy', 'ca');
                })
                return task;

        }),
    );
  }

  delete(id: number): Observable<Task>{
    return this.http.delete<Task>(`${this.urlEndPoint}/${id}`).pipe(
        catchError(e => {

          if (e.error.message) {
            console.error(e.error.message);
            swal.fire('Error al eliminar', e.error.message, 'error');
          }

          return throwError(e);
        })

    )
  }

  uploadInformations(term: string): Observable<Information[]>{
    return this.http.get<Information[]>(`${this.urlEndPoint}/upload-informations/${term}`);
  }

  create(task: Task): Observable<any>{
      return this.http.post<Task>(this.urlEndPoint, task).pipe(
        catchError(e => {

          if (e.status == 400) {
            return throwError(e);
          }
          if (e.error.message) {
            console.error(e.error.message);
          }
          return throwError(e);
        })
      )
  }

  update(task: Task): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${task.id}`, task).pipe(
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }
        if (e.error.message) {
          console.error(e.error.message);
        }

        return throwError(e);
      })
    )
  }

}
