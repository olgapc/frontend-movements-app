import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../roles/role';
import { AuthService } from './auth.service';
import { User } from './models/user';
import { UserService } from './user.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html'
})
export class FormUserComponent implements OnInit {

  public user: User = new User();
  public roles: Role[];
  public userRoles: Role[]=[];
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
      let id = +params['id']
      if(id) {
        this.userService.getUser(id).subscribe((user) => this.user = user);
      }
    });
    this.userService.getRoles().subscribe(roles => this.roles = roles);
  }

  public create(): void {
    console.log(this.user);
    this.userService.create(this.user)
      .subscribe(
        //response => this.router.navigate(['/companies'])
        json => {
          this.router.navigate(['/users'])
          swal.fire('Nou Usuari', `${json.message}: ${json.user.username}`, 'success')
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
          swal.fire('Usuari actualitzat', `${json.message}: ${json.user.username}`, 'success')
        },
        err => {
          this.errors = err.error.errors as string[];
          console.error('Codi de l\'error des del backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }

  compareRoles(role1: Role, role2: Role){

      if (role1==null || role2 == null){
          return false;
      }
      return role1.description === role2.description;
  }

}
