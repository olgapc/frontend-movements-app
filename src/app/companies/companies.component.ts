import { Component, OnInit } from '@angular/core';
import { Company } from './company';
import { CompanyService } from './company.service';
import { ModalService } from './view/modal.service';
import Swal from 'sweetalert2'
import { tap } from 'rxjs/operators';
import { AuthService } from '../users/auth.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html'
})
export class CompaniesComponent implements OnInit {

  companies: Company[];
  selectedCompany: Company;
  paginator: any;
  linkPaginator: string = '/companies/page';


  constructor(private companyService: CompanyService,
    private modalService: ModalService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.companyService.getCompanies(page)
        .pipe(
          tap(response => {
            console.log('CompaniesComponent: tap 3');
            (response.content as Company[]).forEach(company => {
              console.log(company.name);
            });
          })

        ).subscribe(
          response => {
            this.companies = response.content as Company[];
            //is the same than: function (companies) {this.companies = companies}
            this.paginator = response;
          }
        );
    });

    this.modalService.notifyUpload.subscribe(company => {
      this.companies = this.companies.map(originalCompany => {
        if (company.id == originalCompany.id) {
          originalCompany.image = company.image;
        }
        return originalCompany;
      })
    })

  }


  delete(company: Company): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-info',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Segur?',
      text: `Vols eliminar l'empresa ${company.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, esborra!',
      cancelButtonText: 'No, cancela!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.companyService.delete(company.id).subscribe(
          () => {
            this.companies = this.companies.filter(comp => comp !== company)
            swalWithBootstrapButtons.fire(
              'Empresa eliminada!',
              `Empresa ${company.name} eliminada amb èxit.`,
              'success'
            )
          }
        )
      }
    })
  }

  openModal(company: Company) {
    this.selectedCompany = company;
    this.modalService.openModal();
  }


}
