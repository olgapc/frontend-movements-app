import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Information } from '../models/information';
import { InformationService } from '../services/information.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-form-information',
  templateUrl: './form-information.component.html'
})
export class FormInformationComponent implements OnInit {

  public information: Information = new Information();
  public title: string = 'Formulari d\'informació';

  //autocompleteControl = new FormControl();
  public errors: string[];

  constructor(private informationService: InformationService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = +params['id']
      if(id) {
        this.informationService.getInformation(id).subscribe(information => this.information = information)
      }
    });
  }

  public create(): void {
    console.log(this.information);
    this.informationService.create(this.information)
      .subscribe(
        json => {
          this.router.navigate(['/informations'])
          Swal.fire('Nova informació', `${json.message}: ${json.information.description}`, 'success')
        },
        err => {
          this.errors = err.error.errors as string[];
          console.error('Codi de l\'error des del backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
  }


  public update(): void {
    console.log(this.information);
    this.informationService.update(this.information)
      .subscribe(
        json => {
          this.router.navigate(['/informations'])
          Swal.fire('Informació actualitzada', `${json.message}: ${json.information.description}`, 'success')
        },
        err => {
          this.errors = err.error.errors as string[];
          console.error('Codi de l\'error del backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }
}
