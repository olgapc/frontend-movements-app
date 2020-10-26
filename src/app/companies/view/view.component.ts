import { Component, OnInit, Input } from '@angular/core';
import { Company } from '../company';
import { CompanyService } from '../company.service';
import { ModalService } from './modal.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from 'src/app/users/auth.service';
import { TaskService } from 'src/app/tasks/services/task.service';
//import Swal from 'sweetalert2';
import { Task } from 'src/app/tasks/models/task';
import { Employee } from 'src/app/employees/employee';

@Component({
  selector: 'company-view',
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit {

  //input for Modal, without Modal: ngOnInit()
  @Input() company: Company;

  title: string = "Detall del client";
  public selectedImage: File;
  public progress: number = 0;


  constructor(private companyService: CompanyService,
    private taskService: TaskService,
    //private activatedRoute: ActivatedRoute, //Commented because we use Modal
    public modalService: ModalService,
    public authService: AuthService) { }

  ngOnInit(){}
    //:void
    //Comment because we use a Modal, with Modal, the attribute company with annotation @Input()
    //this.activatedRoute.paramMap.subscribe(params =>{
      //let id:number = + params.get('id');
      //if (id){
        //this.companyService.getCompany(id).subscribe(company => {
          //this.company = company;
        //});
      //}
    //});
//}

  selectImage(event){
    this.selectedImage = event.target.files[0];
    this.progress = 0;
    console.log(this.selectedImage);
    if(this.selectedImage.type.indexOf('image') < 0){
      swal.fire('Error al seleccionar imatge', 'L\'arxiu ha de ser de tipus imatge', 'error');
      this.selectedImage = null;
    }
  }


  uploadImage(){

    if(!this.selectedImage){
      swal.fire('Error al pujar', 'Ha de seleccionar una imatge', 'error');
    }
    else {
      this.companyService.uploadImage(this.selectedImage, this.company.id)
      .subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progress = Math.round((event.loaded/event.total)*100);
        } else if(event.type === HttpEventType.Response) {
          let response: any = event.body;
          this.company = response.company as Company;

          this.modalService.notifyUpload.emit(this.company);
          swal.fire('La imatge s\'ha pujat completament', response.message , 'success');
        }
      });
    }
  }

  closeModal(){
    this.modalService.closeModal();
    this.selectedImage = null;
    this.progress = 0;
  }


  deleteTask(task: Task):void{
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-info',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Segur?',
      text: `Vols eliminar la tasca ${task.description}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, esborra!',
      cancelButtonText: 'No, cancela!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.taskService.delete(task.id).subscribe(
          () => {
            this.company.tasks = this.company.tasks.filter(t => t !== task)
            swalWithBootstrapButtons.fire(
              'Tasca eliminada!',
              `Tasca ${task.description} eliminada amb èxit.`,
              'success'
            )
          }
        )}
      })
  }

  deleteEmployee(employee: Employee):void{
    const swalWithBootstrapButtons = swal.mixin({
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
      if (result.value) {
        this.taskService.delete(employee.id).subscribe(
          () => {
            this.company.employees = this.company.employees.filter(t => t !== employee)
            swalWithBootstrapButtons.fire(
              'Treballador eliminat!',
              `Treballador ${employee.name} eliminat amb èxit.`,
              'success'
            )
          }
        )}
      })
  }
}
