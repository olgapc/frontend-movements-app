import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Task } from '../models/task';
import { formatDate } from '@angular/common';
import { catchError, map } from 'rxjs/operators';
import { Information } from '../models/information';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DataTablesResponse } from '../models/data-tables-response';
import { User } from 'src/app/users/models/user';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private urlEndPoint: string = 'http://localhost:8090/api/tasks';

  constructor(private http: HttpClient, private router: Router) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.urlEndPoint);

    //return this.http.get(this.urlEndPoint).pipe(

    //map ((response:any) => {

    //(response.content as Task []).map(task => {
    //task.description = task.description.toUpperCase();
    //task.createAt = formatDate(task.createAt, 'EEE dd-MM-yyyy hh:mm', 'ca');
    //task.deadline = formatDate(task.deadline, 'EEE dd-MM-yyyy', 'ca');
    //return task;
    //});
    //return response;
    //}),
    //);
  }

  getTasksPage(page: number): Observable<any> {

    return this.http.get(this.urlEndPoint +'/datatable/page+' + page).pipe(

      map((response: any) => {
        (response.content as Task[]).map(task => {
          task.description = task.description.toUpperCase();
          return task;
        });
        response.pagination.totalCount = response.content.length;
        return response;
      }),
    );
    //return this.http.get<Task[]>(this.urlEndPoint);
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/employees']);
          console.error(e.error.message);
        }

        return throwError(e);
      }),

      map(task => {
        task.description = task.description.toUpperCase();
        //task.createAt = formatDate(task.createAt, 'EEE dd-MM-yyyy', 'ca');
        //task.deadline = formatDate(task.deadline, 'EEE dd-MM-yyyy', 'ca');
        task.taskInformations.forEach(taskInformation => {
          taskInformation.information.description = taskInformation.information.description.toUpperCase();
          //taskInformation.createAt = formatDate(taskInformation.createAt, 'EEE dd-MM-yyyy', 'ca');
        })
        //task.subtasks.forEach(subtask => {
        //    subtask.description = subtask.description.toUpperCase();
        //subtask.createAt = formatDate(subtask.createAt, 'EEE dd-MM-yyyy', 'ca');
        //subtask.deadline = formatDate(subtask.deadline, 'EEE dd-MM-yyyy', 'ca');
        //})
        console.log(task);
        return task;

      }),
    );
  }

  delete(id: string): Observable<Task> {
    return this.http.delete<Task>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        if (e.error.message) {
          console.error(e.error.message);
          Swal.fire('Error al eliminar', e.error.message, 'error');
        }

        return throwError(e);
      })

    )
  }

  filterInformations(term: string): Observable<Information[]> {
    return this.http.get<Information[]>(`${this.urlEndPoint}/upload-informations/${term}`);
  }

  //getUser(username: string): Observable<User> {
    //  return this.http.get<User>(`${this.urlEndPoint}/get-user/${username}`);
  //}

  create(task: Task): Observable<any> {

    return this.http.post<any>(this.urlEndPoint, task).pipe(
      catchError(e => {
          console.log("aqui també està error");
          console.log();
        if (e.status == 400) {
            console.log("aqui hola està error");
          return throwError(e);
        }
        if (e.error.message) {
            console.log("aqui està error");
          console.error(e.error.message);
        }
        console.log(e.status);
        return throwError(e);
      })
    )
  }

  update(task: Task): Observable<any> {
    //task.createAt = formatDate(task.createAt, 'yyyy-MM-dd', 'es');
    task.deadline = formatDate(task.deadline, 'yyyy-MM-dd', 'es');

    return this.http.put<any>(`${this.urlEndPoint}/${task.id}`, task).pipe(
      //map(task => {
        //task.description = task.description.toUpperCase();

        //task.taskInformations.forEach(taskInformation => {
          //taskInformation.information.description = taskInformation.information.description.toUpperCase();
          //taskInformation.createAt = formatDate(taskInformation.createAt, "yyyy-MM-dd HH:mm:ss", 'es');
        //})
        //task.subtasks.forEach(subtask => {
          //subtask.description = subtask.description.toUpperCase();
          //subtask.createAt = formatDate(subtask.createAt, "yyyy-MM-dd HH:mm:ss", 'es');
          //subtask.deadline = formatDate(subtask.deadline, "yyyy-MM-dd", 'es');
        //})
        //return task;

      //}),
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
  getTasksDatatable(): Observable<DataTablesResponse> {

    return this.http.get<DataTablesResponse>(this.urlEndPoint +'/datatable1');


    //return this.http.get<Task[]>(this.urlEndPoint);
  }

  getTasksByUser(user:User): Observable<Task[]> {
      if(user==null){
          console.log("aquí es null");
          return this.http.get<Task[]>(`${this.urlEndPoint}/user/null`);
      }
      console.log(user.username);
    return this.http.get<Task[]>(`${this.urlEndPoint}/user/${user.username}`);
}

}
