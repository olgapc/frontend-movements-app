import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import Swal from 'sweetalert2';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  title: string = 'Si us plau, Sign In!';
  user: User;

  constructor(private authService: AuthService, private router: Router) {
    this.user = new User();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      Swal.fire('Login', `Hola ${this.authService.user.username} ya estàs autentificat!`, 'info');
      this.router.navigate(['/companies']);
    }
  }

  login(): void {
    console.log(this.user);
    if(this.user.username == null || this.user.password == null){
      Swal.fire('Error login', 'Username o password buides', 'error');
      return;
    }

    this.authService.login(this.user).subscribe(response => {
      console.log(response);


      this.authService.saveUser(response.access_token);
      this.authService.saveToken(response.access_token);

      let user = this.authService.user;

      this.router.navigate(['/companies']);
      Swal.fire('Login', `Hola ${user.username}, has iniciat sessió amb èxit`, 'success');

    }, err => {

      if(err.status == 400){
        Swal.fire('Error login', 'Usuari i/o clau incorrectes!', 'error');
      }
    }


  );


  }
}
