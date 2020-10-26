import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../companies/company.service';
import { AuthService } from '../users/auth.service';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form-employee',
  templateUrl: './form-employee.component.html'
})
export class FormEmployeeComponent implements OnInit {

  public employee: Employee = new Employee();
  public title: string = "Formulari de Treballador";
  public errors: string[];

  constructor(private employeeService: EmployeeService,
      private companyService: CompanyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService) { }

  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
          let companyId = + params.get('companyId');
          this.companyService.getCompany(companyId).subscribe(company => this.employee.company = company);
      });

  }

  create():void{
      console.log(this.employee);
      this.employeeService.create(this.employee)
      .subscribe(
          json => {
              this.router.navigate(['/employees'])
              swal.fire('Nou treballador', `${json.message}: ${json.employee.name}`, 'success')
          },
          err => {
              this.errors = err.error.errors as string[];
              console.error('Codi de l\'error des del backend: ' +err.status);
              console.error(err.error.errors);
          }
      );
  }

  public update():void {
      console.log(this.employee);
      this.employeeService.update(this.employee)
      .subscribe(
          json => {
            this.router.navigate(['/employees'])
            swal.fire('Treballador actualitzat', `${json.message}: ${json.employee.name}`, 'success')

        },
        err => {
            this.errors = err.error.errors as string[];
            console.error('Codi de l\'error des del backend: ' + err.status);
            console.error(err.error.errors);
        }
      )
  }

}
