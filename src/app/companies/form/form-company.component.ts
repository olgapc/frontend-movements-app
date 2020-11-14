import { Component, OnInit } from '@angular/core';
import { Company } from '../company';
import { CompanyService } from '../company.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/users/services/auth.service';
import { HttpEventType } from '@angular/common/http';
import { CompanyType } from 'src/app/company-types/company-type';

@Component({
  selector: 'app-form',
  templateUrl: './form-company.component.html',

})
export class FormCompanyComponent implements OnInit {

  public company: Company = new Company();
  public companyTypes: CompanyType[];
  public title: string = "Formulari d'Empresa";
  public errors: string[];
  public selectedImage: File;
  public progress: number = 0;

  constructor(private companyService: CompanyService,
    private router: Router,
    private activatedRoute : ActivatedRoute,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.loadCompany();
  }

  public loadCompany(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      console.log("id");
      console.log(id);
      if(id){
        this.companyService.getCompany(id).subscribe(company => this.company = company);
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
        Swal.fire('Nova Empresa', `${json.message}: ${json.company.name}`, 'success')
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
        Swal.fire('Empresa actualitzada', `${json.message}: ${json.company.name}`, 'success')
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error('Codi de l\'error des del backend: ' + err.status);
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

  selectImage(event){
    this.selectedImage = event.target.files[0];
    this.progress = 0;
    console.log(this.selectedImage);
    if(this.selectedImage.type.indexOf('image') < 0){
      Swal.fire('Error al seleccionar imatge', 'L\'arxiu ha de ser de tipus imatge', 'error');
      this.selectedImage = null;
    }
  }

  uploadImage(){

    if(!this.selectedImage){
      Swal.fire('Error al pujar', 'Ha de seleccionar una imatge', 'error');
    }
    else {
      this.companyService.uploadImage(this.selectedImage, this.company.id)
      .subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progress = Math.round((event.loaded/event.total)*100);
        } else if(event.type === HttpEventType.Response) {
          let response: any = event.body;
          this.company = response.company as Company;


          Swal.fire('La imatge s\'ha pujat completament', response.message , 'success');
        }
      });
    }
  }

}
