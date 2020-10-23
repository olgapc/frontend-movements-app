import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from './user';
import { UserService } from './user.service';

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

}
