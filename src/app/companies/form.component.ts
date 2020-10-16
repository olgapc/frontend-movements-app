import { Component, OnInit } from '@angular/core';
import { Company } from './company';
import { CompanyService } from './company.service'
import { Router, ActivatedRoute } from '@angular/router'
import swal from 'sweetalert2'
import { CompanyType } from '../company-types/company-type';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public company: Company = new Company();
  public companyTypes: CompanyType[];
  public title: string = "Formulari d'Empresa";
  public errors: string[];

  constructor(private companyService: CompanyService,
    private router: Router,
    private activatedRoute : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadCompany()
  }

  public loadCompany(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.companyService.getCompany(id).subscribe((company) => this.company = company)
      }
    });
    this.companyService.getCompanyTypes().subscribe(companyTypes => this.companyTypes = companyTypes);
  }


  public create(): void {
    console.log(this.company);
    this.companyService.create(this.company)
    .subscribe(
      //response => this.router.navigate(['/companies'])
      json => {
        this.router.navigate(['/companies'])
        swal.fire('Nova Empresa', `${json.message}: ${json.company.name}`, 'success')
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error('Codi de l\'error des del backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  public update(): void {
    console.log(this.company);
    this.companyService.update(this.company)
    .subscribe(
      json => {
      this.router.navigate(['/companies'])
      swal.fire('Empresa actualitzada', `${json.message}: ${json.company.name}`, 'success')
    },
    err => {
      this.errors = err.error.errors as string[];
      console.error('Cod de l\'error des del backend: ' + err.status);
      console.error(err.error.errors);
    }
  )
  }

  compareCompanyType(o1:CompanyType, o2: CompanyType):boolean {
    if (o1===undefined && o2===undefined){
        return true;
    }
    return o1 === null || o2 === null || o1  === undefined || o2 === undefined? false: o1.id===o2.id;
  }

}
