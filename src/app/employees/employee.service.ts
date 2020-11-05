import { Injectable } from '@angular/core';
import { Employee } from './employee';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private urlEndPoint: string = 'http://localhost:8090/api/employees';

  constructor(private http: HttpClient, private router: Router) { }

  getEmployees(page: number): Observable<any> {
    //return this.http.get<Employee[]>(this.urlEndPoint);

    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(

      map((response: any) => {

        (response.content as Employee[]).map(employee => {
          employee.name = employee.name.toUpperCase();
          //employee.createAt = formatDate(employee.createAt, 'EEE dd-MM-yyyy hh:mm', 'ca');
          return employee;
        });
        return response;
      }),
    );
  }

  create(employee: Employee): Observable<any> {

    return this.http.post<any>(this.urlEndPoint, employee).pipe(
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

  getEmployee(id): Observable<Employee> {
    return this.http.get<Employee>(`${this.urlEndPoint}/${id}`).pipe(

      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/employees']);
          console.error(e.error.message);
        }

        return throwError(e);
    }),

    map((employee: Employee) => {
            employee.name = employee.name.toUpperCase();
            //employee.createAt = formatDate(employee.createAt, 'EEE dd-MM-yyyy hh:mm', 'ca');
            //employee.company.createAt = formatDate(employee.company.createAt, 'EEE dd-MM-yyyy hh:mm', 'ca');

        return employee;
    }),

);
  }

  update(employee: Employee): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${employee.id}`, employee).pipe(
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

  delete(id: number): Observable<Employee> {
    return this.http.delete<Employee>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        if (e.error.message) {
          console.error(e.error.message);
          swal.fire('Error al eliminar', e.error.message, 'error');
        }

        return throwError(e);
      })
    )
  }

  //  uploadImage(file: File, id):Observable<HttpEvent<{}>>{

  //      let formData = new FormData();
  //    formData.append("file", file);
  //  formData.append("id", id);

  //const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`,formData, {
  //reportProgress: true
  //  });

  //  return this.http.request(req);
  //}

}
