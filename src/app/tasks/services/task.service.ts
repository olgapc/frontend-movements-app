import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { formatDate } from '@angular/common';
import { map } from 'rxjs/operators';
import { Information } from '../models/information';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private urlEndPoint: string = 'http://localhost:8090/api/tasks';

  constructor(private http: HttpClient) { }

  getTasks(page:number): Observable<any>{
    //return this.http.get<Task[]>(this.urlEndPoint);

    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(

      map ((response:any) => {

        (response.content as Task []).map(task => {
          task.description = task.description.toUpperCase();
          task.createAt = formatDate(task.createAt, 'EEE dd-MM-yyyy', 'ca');
          task.deadline = formatDate(task.deadline, 'EEE dd-MM-yyyy', 'ca');
          return task;
        });
        return response;
      }),
    );
  }

  getTask(id:number):Observable<Task>{
    return this.http.get<Task>(`${this.urlEndPoint}/${id}`).pipe(

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

  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  uploadInformations(term: string): Observable<Information[]>{
    return this.http.get<Information[]>(`${this.urlEndPoint}/upload-informations/${term}`);
  }

  create(task: Task): Observable<any>{
      return this.http.post<Task>(this.urlEndPoint, task);
  }

}
