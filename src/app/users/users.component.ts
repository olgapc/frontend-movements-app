import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from './models/user';
import { UserService } from './user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  title: string = 'Nou Usuari';
  user: User = new User();
  users: User[];
  paginator: any;
  linkPaginator: string = '/users/page';

  constructor(private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private userService: UserService) { }

  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
        let page: number = +params.get('page');

        if (!page) {
          page = 0;
        }

        this.userService.getUsers(page)
          .subscribe(response => {
            this.users = response.content as User[];
            this.paginator = response;
          })
      }

      );
  }

  delete(user: User): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-info',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Segur?',
      text: `Vols eliminar l'usuari ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, esborra!',
      cancelButtonText: 'No, cancela!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.userService.delete(user.id).subscribe(
          () => {
            this.users = this.users.filter(us => us !== user)
            swalWithBootstrapButtons.fire(
              'Usuari eliminat!',
              `Usuari ${user.name} eliminat amb èxit.`,
              'success'
            )
          }
        )
      }
    })
  }

}
