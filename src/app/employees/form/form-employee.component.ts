import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/companies/company.service';
import { Gender } from 'src/app/enums/gender.enum';
import { NifType } from 'src/app/enums/nif-types.enum';
import { AuthService } from 'src/app/users/auth.service';
import Swal from 'sweetalert2';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';


@Component({
  selector: 'app-form-employee',
  templateUrl: './form-employee.component.html'
})
export class FormEmployeeComponent implements OnInit {

  public employee: Employee = new Employee();
  public title: string = "Formulari de Treballador";
  public errors: string[];
  //public nifTypeEnum = NifType;
  //public enumKeys = [];

  public eNifType = NifType;
  public eGender = Gender;



  constructor(private employeeService: EmployeeService,
    private companyService: CompanyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService) {
    //this.enumKeys = Object.keys(this.nifTypeEnum);
  }


  ngOnInit(): void {
    this.loadEmployee();
  }

  public loadEmployee(): void{
      this.activatedRoute.params.subscribe(params => {
          let companyId = +params['companyId']
          let employeeId = +params['employeeId']
          if(employeeId){
              this.employeeService.getEmployee(employeeId).subscribe((employee) => this.employee  = employee);
          } else if (companyId){
              this.companyService.getCompany(companyId).subscribe(company => this.employee.company = company);
          }
      });

  }

  create(): void {
    console.log(this.employee);
    this.employeeService.create(this.employee)
      .subscribe(
        json => {
          this.router.navigate(['/employees'])
          Swal.fire('Nou treballador', `${json.message}: ${json.employee.name}`, 'success')
        },
        err => {
          this.errors = err.error.errors as string[];
          console.error('Codi de l\'error des del backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
  }

  public update(): void {
    console.log(this.employee);
    this.employeeService.update(this.employee)
      .subscribe(
        json => {
          this.router.navigate(['/employees'])
          Swal.fire('Treballador actualitzat', `${json.message}: ${json.employee.name}`, 'success')

        },
        err => {
          this.errors = err.error.errors as string[];
          console.error('Codi de l\'error des del backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }


}
