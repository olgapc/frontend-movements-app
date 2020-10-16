import { Component, OnInit } from '@angular/core';
import { Role } from './role';
import { RoleService } from './role.service';



@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  role: Role[];

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.roleService.getRoles().subscribe(
      role => this.role = role
    );
  }

}
