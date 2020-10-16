import { Injectable } from '@angular/core';
import { Role } from './role';
import { of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private urlEndPoint : string = 'http://localhost:8090/api/roles';

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(this.urlEndPoint);
  }
}
