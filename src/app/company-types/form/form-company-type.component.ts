import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CompanyType } from '../company-type';
import { CompanyTypeService } from '../company-type.service';

@Component({
  selector: 'app-form-company-type',
  templateUrl: './form-company-type.component.html'
})
export class FormCompanyTypeComponent implements OnInit {

  public companyType: CompanyType = new CompanyType();
  public title: string = 'Formulari de tipus d\'empresa';

  public errors: string[];

  constructor(private companyTypeService: CompanyTypeService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = + params['id']
      if (id) {
        this.companyTypeService.getCompanyType(id).subscribe(companyType => this.companyType = companyType)
      }
    });

  }

  public create(): void {
    console.log(this.companyType);
    this.companyTypeService.create(this.companyType)
      .subscribe(
        json => {
          this.router.navigate(['company_types'])
          Swal.fire('Nou tipus d\'empresa', `${json.message}: ${json.companyType.description}`, 'success')
        },
        err => {
          this.errors = err.error.errors as string[];
          Swal.fire('Error', `${err.error.errors}`, 'error');
          console.error('Codi de l\'error des del backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
  }

  public update(): void {
    console.log(this.companyType);
    this.companyTypeService.update(this.companyType)
      .subscribe(
        json => {
          this.router.navigate(['/company_types'])
          Swal.fire('Tipus d\'empresa actualitzat', `${json.message}: ${json.companyType.description}`, 'success')
        },
        err => {
          this.errors = err.error.errors as string[];
          Swal.fire('Error', `${err.error.errors}`, 'error');
          console.error('Codi de l\'error del backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }
}
