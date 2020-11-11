import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyType } from '../company-type';
import { CompanyTypeService } from '../company-type.service';

@Component({
  selector: 'app-view-company-type',
  templateUrl: './view-company-type.component.html'
})
export class ViewCompanyTypeComponent implements OnInit {

    companyType: CompanyType;
    title: string = 'Tipus d\'empresa';

  constructor(private companyTypeService: CompanyTypeService,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
          let id = +params.get('id');
          this.companyTypeService.getCompanyType(id).subscribe(companyType => this.companyType = companyType);
      });
  }

}
