import { Component } from '@angular/core';
import { AuthService } from '../users/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
  //si és menys de 4 línies de codi html: template: 'el que volguem posar...' amb codi html
})
export class HeaderComponent {
  title: string = 'Movements'

  constructor(public authService: AuthService, private router: Router){

  }

  logout(): void{

    let username = this.authService.user.username;
    this.authService.logout();
    Swal.fire('Logout', `Adéu ${username}, has tancat sessió amb èxit!`, 'success');
    this.router.navigate(['/login']);
  }
}
