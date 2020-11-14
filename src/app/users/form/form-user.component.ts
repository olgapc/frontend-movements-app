import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Role } from '../models/role';
import { UserRole } from '../models/user-role';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html'
})
export class FormUserComponent implements OnInit {

  public user: User = new User();
  public allRoles: Role[];

  //public userRoles: UserRole[];
  public title: string = "Formulari d'Usuari";
  public errors: string[];
  //public filteredUserRole: Observable<UserRole>;


  constructor(private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.loadUser();
  }

  public loadUser(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = +params['id']
      if (id) {
        this.userService.getUser(id)
          //.pipe(
          //tap(user => {
          //console.log("user : ");
          //console.log(user);
          //user.userRoles.forEach(element => {
          //console.log("aqui tinc usuari");
          //console.log(element.role);
          //this.thisUserRoles.push(element.role);
          //console.log("hello " + element.role);
          //});
          //}
          //)
          //)
          .subscribe(user => this.user = user);
      }
    })

    this.userService.getRoles().subscribe(roles => this.allRoles = roles);
  }


  public create(): void {
    console.log(this.user);
    this.userService.create(this.user)
      .subscribe(
        //response => this.router.navigate(['/companies'])
        json => {
          this.router.navigate(['/users'])
          Swal.fire('Nou Usuari', `${json.message}: ${json.user.username}`, 'success')
        },
        err => {
          this.errors = err.error.errors as string[];
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
          console.error('Codi de l\'error des del backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }

  compareRoles(role1: Role, role2: Role) {

    if (role1 == null || role2 == null) {
      return false;
    }
    return role1.description === role2.description;
  }

  hasRole(role: Role): boolean {

    let thisUserRoles: string[]=[];

    this.user.userRoles.forEach(element => {
      thisUserRoles.push(element.role.description);
  })
  return thisUserRoles.includes(role.description);
}


  public roleChange(id: number, event): void {
        let newUserRole: UserRole;
        if(event.target.checked) {
          for (let role of this.allRoles) {
            if (role.id == id) {
              newUserRole.role = role;
              newUserRole.createAt = formatDate(Date.now(), "yyyy-MM-dd HH:mm:ss", 'ca');
            }
          }
          this.user.userRoles.push(newUserRole);
        } else {
          this.user.userRoles.forEach((role, index) => {
            if (role.id == id) {
              this.user.userRoles.splice(index, 1);
            }
          });
        }

      }

}
