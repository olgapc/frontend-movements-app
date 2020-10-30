import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Information } from '../models/information';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  private urlEndPoint: string = 'http://localhost:8090/api/informations';

  constructor(private http: HttpClient, private router: Router) { }

  getInformations(page: number): Observable<any> {

    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(

      map((response: any) => {

        (response.content as Information[]).map(information => {

          information.description = information.description.toUpperCase();
          information.createAt = formatDate(information.createAt, 'EEE dd-MM-yyyy hh:mm', 'ca');

          return information;
        });
        return response;
      })
    );
  }

  create(information: Information): Observable<any> {
    return this.http.post<any>(this.urlEndPoint, information).pipe(
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

  getInformation(id): Observable<Information> {
    return this.http.get<Information>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/informations']);
          console.error(e.error.message);
        }

        return throwError(e);
    }),

    map((information: Information) => {
        information.createAt = formatDate(information.createAt, 'EEE dd-MM-yyyy hh:mm', 'ca');

        return information;
    }),
);
  }

  update(information: Information): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${information.id}`, information).pipe(
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

  delete(id: number): Observable<Information> {
    return this.http.delete<Information>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        if (e.error.message) {
          console.error(e.error.message);
          swal.fire('Error al eliminar', e.error.message, 'error');
        }

        return throwError(e);
      })
    )
  }


}
