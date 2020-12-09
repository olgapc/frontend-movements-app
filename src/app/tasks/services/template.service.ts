import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Task } from '../models/task';
import { formatDate } from '@angular/common';
import { catchError, map } from 'rxjs/operators';
import { Information } from '../models/information';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private urlEndPoint: string = 'http://localhost:8090/api/templates';

  constructor(private http: HttpClient, private router: Router) { }

  getTemplates(): Observable<Task[]>{
    return this.http.get<Task[]>(this.urlEndPoint);

    //return this.http.get(this.urlEndPoint + '/page/' + page).pipe(

      //map ((response:any) => {

        //(response.content as Task []).map(task => {
          //task.description = task.description.toUpperCase();
          //return task;
        //});
        //return response;
      //}),
    //);
  }



}
