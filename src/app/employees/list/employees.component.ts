import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { EmployeeService } from '../employee.service';
import { AuthService } from 'src/app/users/auth.service';
import { Employee } from '../employee';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html'
})
export class EmployeesComponent implements OnInit {

  employees: Employee[];
  selectedEmployee: Employee;
  paginator: any;
  linkPaginator: string = '/employees/page';


  constructor(private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.employeeService.getEmployees(page)
        .subscribe(
          response => {
            this.employees = response.content as Employee[];
            this.paginator = response;
        });
    }
    );
  }

  delete( employee: Employee): void {
      const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
              confirmButton: 'btn btn-info',
              cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
      })

      swalWithBootstrapButtons.fire({
          title: 'Segur?',
          text: `Vols eliminar el treballador ${employee.name}?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, esborra!',
          cancelButtonText: 'No, cancela!',
          reverseButtons: true
      }).then((result) => {
          if (result.value){
              this.employeeService.delete(employee.id).subscribe(
                  () => {
                      this.employees = this.employees.filter(emp => emp !== employee)
                      swalWithBootstrapButtons.fire(
                          'Treballador eliminat!',
                          `Treballador ${employee.name} eliminat amb èxit.`,
                          'success'
                      )
                  }
              )
          }
      })
  }

}
