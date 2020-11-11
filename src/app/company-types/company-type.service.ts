import { Injectable } from '@angular/core';
import { CompanyType } from './company-type';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CompanyTypeService {

  private urlEndPoint: string = 'http://localhost:8090/api/company_types';

  constructor(private http: HttpClient, private router: Router) { }

  getCompanyTypesList(): Observable<CompanyType[]> {
    return this.http.get<CompanyType[]>(this.urlEndPoint);
  }


  getCompanyTypes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as CompanyType[]).map(companyType => {
          companyType.description = companyType.description.toUpperCase();
          return companyType;
        });
        return response;

      })
    );
  }

  create(companyType: CompanyType): Observable<any> {
    return this.http.post<any>(this.urlEndPoint, companyType).pipe(
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

  getCompanyType(id): Observable<CompanyType> {
    return this.http.get<CompanyType>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/company_types']);
          console.error(e.error.message);
        }

        return throwError(e);
      }),

    );
  }


    update(companyType: CompanyType): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/${companyType.id}`, companyType).pipe(
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

    delete(id: number): Observable<CompanyType> {
      return this.http.delete<CompanyType>(`${this.urlEndPoint}/${id}`).pipe(
        catchError(e => {

          if (e.error.message) {
            console.error(e.error.message);
            Swal.fire('Error al eliminar', e.error.message, 'error');
          }

          return throwError(e);
        })
      )
    }



}
