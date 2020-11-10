import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../users/auth.service';
import { Information } from './models/information';
import { InformationService } from './services/information.service';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html'
})
export class InformationsComponent implements OnInit {

  title: string = 'Nova informació';
  information: Information = new Information();
  informations: Information[];
  selectedInformation: Information;
  paginator: any;
  linkPaginator: string = '/informations/page';

  constructor(private informationService: InformationService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.informationService.getInformations(page).subscribe(
        response => {
          this.informations = response.content as Information[];
          this.paginator = response;
        })
    });
  }

  delete(information: Information): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-info',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Segur?',
      text: `Vols eliminar l'informació ${information.description}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, esborra!',
      cancelButtonText: 'No, cancela!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.informationService.delete(information.id).subscribe(
          () => {
            this.informations = this.informations.filter(info => info !== information)
            swalWithBootstrapButtons.fire(
              'Informació eliminada!',
              `Informació ${information.description} eliminada amb èxit.`,
              'success'
            )
          }
        )
      }
    })
  }


}
