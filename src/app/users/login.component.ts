import { Component, OnInit } from '@angular/core';
import { User } from './user';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title: string = 'Si us plau, Sign In!';
  user: User;

  constructor(private authService: AuthService, private router: Router) {
    this.user = new User();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      swal.fire('Login', `Hola ${this.authService.user.username} ya estàs autentificat!`, 'info');
      this.router.navigate(['/companies']);
    }
  }

  login(): void {
    console.log(this.user);
    if(this.user.username == null || this.user.password == null){
      swal.fire('Error login', 'Username o password buides', 'error');
      return;
    }

    this.authService.login(this.user).subscribe(response => {
      console.log(response);


      this.authService.saveUser(response.access_token);
      this.authService.saveToken(response.access_token);

      let user = this.authService.user;

      this.router.navigate(['/companies']);
      swal.fire('Login', `Hola ${user.username}, has iniciat sessió amb èxit`, 'success');

    }, err => {

      if(err.status == 400){
        swal.fire('Error login', 'Usuari i/o clau incorrectes!', 'error');
      }
    }


  );


  }
}
