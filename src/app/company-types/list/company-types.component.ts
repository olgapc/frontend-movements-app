import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/users/services/auth.service';
import Swal from 'sweetalert2';
import { CompanyType } from '../company-type';
import { CompanyTypeService } from '../company-type.service';

@Component({
  selector: 'app-company-types',
  templateUrl: './company-types.component.html'
})
export class CompanyTypesComponent implements OnInit {

  title: string = 'Nou tipus d\'empresa';
  companyType: CompanyType = new CompanyType();
  companyTypes: CompanyType[];
  paginator: any;
  linkPaginator: string = '/informations/page';

  constructor(private companyTypeService: CompanyTypeService, public authService: AuthService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.companyTypeService.getCompanyTypes(page).subscribe(
        response => {
          this.companyTypes = response.content as CompanyType[];
          this.paginator = response;
        })
    });
  }

  delete(companyType: CompanyType): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-info',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Segur?',
      text: `Vols eliminar el tipus d'empresa ${companyType.description}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, esborra!',
      cancelButtonText: 'No, cancela!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.companyTypeService.delete(companyType.id).subscribe(
          () => {
            this.companyTypes = this.companyTypes.filter(info => info !== companyType)
            swalWithBootstrapButtons.fire(
              'Tipus d\'empresa eliminat!',
              `Tipus d\'empresa ${companyType.description} eliminat amb èxit.`,
              'success'
            )
          }
        )
      }
    })
  }

}
