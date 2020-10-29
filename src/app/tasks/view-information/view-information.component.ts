import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Information } from '../models/information';
import { InformationService } from '../services/information.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-view-information',
  templateUrl: './view-information.component.html'
})
export class ViewInformationComponent implements OnInit {

    information: Information;
    title: string = 'Informació';


  constructor(private informationService: InformationService,
      private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
          let id = +params.get('id');
          this.informationService.getInformation(id).subscribe(information => this.information = information);
      });
  }


  
}
