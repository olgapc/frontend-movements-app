import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html'
})
export class ViewUserComponent implements OnInit {
  user: User;
  title: string = 'Usuari';

  constructor(private userService: UserService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let idString = params.get('idString');
      this.userService.getUser(idString).subscribe(user =>
        this.user = user);
    });
  }

}
