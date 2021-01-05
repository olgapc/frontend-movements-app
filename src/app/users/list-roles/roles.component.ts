import { Component, OnInit } from '@angular/core';
import { Role } from '../models/role';
import { RoleService } from '../services/role.service';



@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {

  roles: Role[];

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.roleService.getRoles().subscribe(
      roles => this.roles = roles
    );
  }

}
