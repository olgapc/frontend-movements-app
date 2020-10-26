import { Component, OnInit } from '@angular/core';
import { CompanyType } from './company-type';
import { CompanyTypeService } from './company-type.service';

@Component({
  selector: 'app-company-types',
  templateUrl: './company-types.component.html'
})
export class CompanyTypesComponent implements OnInit {

  companyType: CompanyType[];

  constructor(private companyTypeService: CompanyTypeService) { }

  ngOnInit(): void {
    this.companyTypeService.getCompanyTypes().subscribe(
      companyType => this.companyType = companyType
    );
  }

}
