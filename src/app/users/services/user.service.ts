import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Role } from '../models/role';
import { User } from '../models/user';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private urlEndPoint: string = 'http://localhost:8090/api/users';

    constructor(private http: HttpClient,
        private router: Router,
        private roleService: RoleService) { }


    getUsers(page: number): Observable<any> {

      return this.http.get(this.urlEndPoint + '/page/' + page).pipe(

        map((response: any) => {

          (response.content as User[]).map(user => {
            user.username = user.username.toUpperCase();
            user.name = user.name.toUpperCase();
            user.lastName = user.lastName.toUpperCase();
            //user.createAt = formatDate(user.createAt, 'EEE dd-MM-yyyy hh:mm', 'ca');
            return user;
          });
          return response;
        }),
      );
    }

    create(user: User): Observable<any> {

      return this.http.post<any>(this.urlEndPoint, user).pipe(
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

    getUser(id:number): Observable<User> {
      return this.http.get<User>(`${this.urlEndPoint}/${id}`).pipe(
        catchError(e => {
          if (e.status != 401 && e.error.message) {
            this.router.navigate(['/users']);
            console.error(e.error.message);
          }
          return throwError(e);
        })
      )
    }

    update(user: User): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/${user.id}`, user).pipe(
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

    delete(id: number): Observable<User> {
      return this.http.delete<User>(`${this.urlEndPoint}/${id}`).pipe(
        catchError(e => {

          if (e.error.message) {
            console.error(e.error.message);
            Swal.fire('Error al eliminar', e.error.message, 'error');
          }

          return throwError(e);
        })
      )
    }

    getRoles(): Observable<Role[]>{
        return this.roleService.getRoles();
    }
}
