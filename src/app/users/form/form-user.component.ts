import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Role } from '../models/role';
import { UserRole } from '../models/user-role';
import { formatDate } from '@angular/common';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html'
})
export class FormUserComponent implements OnInit {

  public user: User = new User();
  public allRoles: Role[];
  public title: string = "Formulari d'Usuari";
  public errors: string[];



  constructor(private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.loadUser();
  }

  public loadUser(): void {
    this.activatedRoute.params.subscribe(params => {
      let idString = params['idString']
      if (idString) {
        this.userService.getUser(idString).subscribe(user => this.user = user);
      } else {
        this.user.isEnabled = true;
      }
    })

    this.userService.getRoles().subscribe(roles => this.allRoles = roles);
  }


  public create(): void {
    console.log(this.user);
    this.userService.create(this.user)
      .subscribe(
        json => {
          this.router.navigate(['/users'])
          Swal.fire('Nou Usuari', `${json.message}: ${json.user.username}`, 'success')
        },
        err => {
          this.errors = err.error.errors as string[];
          Swal.fire('Error', `${err.error.errors}`, 'error');
          console.error('Codi de l\'error des del backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
  }

  public update(): void {
    console.log(this.user);
    this.userService.update(this.user)
      .subscribe(
        json => {
          this.router.navigate(['/users'])
          Swal.fire('Usuari actualitzat', `${json.message}: ${json.user.username}`, 'success')
        },
        err => {
          this.errors = err.error.errors as string[];
          Swal.fire('Error', `${err.error.errors}`, 'error');
          console.error('Codi de l\'error des del backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }


  hasRole(role: Role): boolean {

    let exists = false;

    this.user.userRoles.forEach((userRole: UserRole) => {
      if (role.id === userRole.role.id) {
        exists = true;
      }
    });
    return exists;
  }

  public selectRole(role: Role, event: MatCheckboxChange): void {

    if (event.checked) {
      if (!this.hasRole(role)) {
        let newUserRole = new UserRole();
        newUserRole.role = role;
        this.user.userRoles.push(newUserRole);
        newUserRole.createAt = formatDate(Date.now(), "yyyy-MM-dd HH:mm:ss", 'ca');
      }

    } else {

      if (this.hasRole(role)) {
        this.user.userRoles.forEach((userRole, index) => {

          if (userRole.role.id === role.id) {
            this.user.userRoles.splice(index, 1);
          }
        });
      }
    }

  }

}
