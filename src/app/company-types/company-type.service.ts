import { Injectable } from '@angular/core';
import { CompanyType } from './company-type';
import { of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyTypeService {

  private urlEndPoint : string = 'http://localhost:8090/api/company_types';

  constructor(private http: HttpClient) { }

  getCompanyTypes(): Observable<CompanyType[]>{
    return this.http.get<CompanyType[]>(this.urlEndPoint);
  }
}
