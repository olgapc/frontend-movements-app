import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Això és Angular, el títol està a app.components.ts';
  application: string = 'Movements';
  autor = 'Olga Pérez Cauhé';
}
