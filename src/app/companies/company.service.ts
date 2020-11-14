import { Injectable } from '@angular/core';
import { Company } from './company';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CompanyType } from '../company-types/company-type';
import Swal from 'sweetalert2';
import { CompanyTypeService } from '../company-types/company-type.service';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private urlEndPoint: string = 'http://localhost:8090/api/companies';


  constructor(private http: HttpClient,
      private router: Router,
      private companyTypeService: CompanyTypeService) { }

  //private addAuthorizationHeader(){
  //let token = this.authService.token;
  //if(token != null) {
  //return this.httpHeaders.append('Authorization', 'Bearer ' + token);
  //}
  //return this.httpHeaders;
  //}




  getCompanyTypes(): Observable<CompanyType[]> {
    return this.companyTypeService.getCompanyTypesList();
  }

  getCompanies(page: number): Observable<any> {
    //return of(COMPANIES);
    //return this.http.get(this.urlEndPoint).pipe(
    //it's the same than: return this.http.get<Company[]>(this.urlEndPoint)
    //map (response => response as Company [] ));
    //it's the same than: map (function (response){return response as Company[]})

    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(

      tap((response: any) => {
        console.log('CompanyService: tap 1');
        (response.content as Company[]).forEach(company => {
          console.log(company.name);
        }
        )
      }),

      map((response: any) => {

        (response.content as Company[]).map(company => {
          company.name = company.name.toUpperCase();
          company.tasks.forEach(task => {
            task.description = task.description.toUpperCase();
          })
          return company;
        });
        return response;
      }),
      //map (response => {
      //let companies = response as Company [];
      //return companies.map(company.tasks => {
      //    let tasks = response as Task[];
      //    return tasks.map(task => {
      //        task.description = task.description.toUpperCase();
      //        task.createAt = formatDate(task.createAt, 'EEE dd-MM-yyyy', 'ca');
      //        return task;
      //    });
      //    return company;

      //});
      //}),

      tap(response => {
        console.log('CompanyService: tap 2');
        (response.content as Company[]).forEach(company => {
          console.log(company.name);
        }
        )
      })
    );

  }

  create(company: Company): Observable<any> {

    return this.http.post<any>(this.urlEndPoint, company).pipe(
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

  getCompany(id): Observable<Company> {
    return this.http.get<Company>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/companies']);
          console.error(e.error.message);
        }

        return throwError(e);
      })
    )
  }

  update(company: Company): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${company.id}`, company).pipe(
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

  delete(id: number): Observable<Company> {
    return this.http.delete<Company>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        if (e.error.message) {
          console.error(e.error.message);
          Swal.fire('Error al eliminar', e.error.message, 'error');
        }

        return throwError(e);
      })
    )
  }

  uploadImage(file: File, id): Observable<HttpEvent<{}>> {

    let formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
