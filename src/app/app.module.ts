import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { CompaniesComponent } from './companies/list/companies.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormCompanyComponent } from './companies/form/form-company.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import localeCa from '@angular/common/locales/ca';
import localeEs from '@angular/common/locales/es';
import { EmployeesComponent } from './employees/list/employees.component';
import { RolesComponent } from './users/list-roles/roles.component';
import { TasksComponent } from './tasks/list/tasks.component';
import { CompanyTypesComponent } from './company-types/list/company-types.component';
import { ViewCompanyComponent } from './companies/view/view-company.component';
import { LoginComponent } from './users/login.component';
import { AuthGuard } from './users/guards/auth.guard';
import { RoleGuard } from './users/guards/role.guard';
import { TokenInterceptor } from './users/interceptors/token.interceptor';
import { AuthInterceptor } from './users/interceptors/auth.interceptor';
import { ViewTaskComponent } from './tasks/view/view-task.component';
import { FormTaskComponent } from './tasks/form/form-task.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { InformationsComponent } from './tasks/list-information/informations.component';
import { UsersComponent } from './users/list/users.component';
import { ViewEmployeeComponent } from './employees/view/view-employee.component';
import { FormEmployeeComponent } from './employees/form/form-employee.component';
import { ViewInformationComponent } from './tasks/view-information/view-information.component';
import { FormInformationComponent } from './tasks/form-information/form-information.component';
import { ViewUserComponent } from './users/view/view-user.component';
import { FormUserComponent } from './users/form/form-user.component';
import { ViewCompanyTypeComponent } from './company-types/view/view-company-type.component';
import { FormCompanyTypeComponent } from './company-types/form/form-company-type.component';
//import { TemplatesComponent } from './tasks/list-templates/templates.component';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
//import { TasksdatatableComponent } from './tasks/list-data-table/tasksdatatable.component';
import { DataTablesModule } from 'angular-datatables';
import { ZeroConfigurationComponent } from './zero-configuration/zero-configuration.component';
//import { TasksByDeadlineComponent } from './tasks/list/tasks-by-deadline.component';
import { TableExpandableRowsExampleComponent } from './tests/table-expandable-rows-example/table-expandable-rows-example.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormNewTaskComponent } from './tasks/form/form-new-task.component';
import { ListItemComponent } from './a-drap-and-drop/list-item/list-item.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { BaseComponent } from './a-drap-and-drop/base/base.component';
//import { TasksByUserComponent } from './tasks/list/tasks-by-user.component';
//import { SubtasksListComponent } from './tasks/subtasks-list/subtasks-list.component';




registerLocaleData(localeCa, 'ca');
registerLocaleData(localeEs, 'es');

const routes: Routes = [
  { path: '', redirectTo: '/companies', pathMatch: 'full' },
  { path: 'companies', component: CompaniesComponent },
  { path: 'companies/page/:page', component: CompaniesComponent },
  { path: 'companies/form', component: FormCompanyComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'companies/form/:id', component: FormCompanyComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'login', component: LoginComponent },
  { path: 'tasks/:id', component: ViewTaskComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'tasks/page/:page', component: TasksComponent },
  //{ path: 'tasks/list/bydeadline', component: TasksByDeadlineComponent},
  //{ path: 'tasks/list/byuser', component: TasksByUserComponent},
  //{ path: 'tasks/datatable/page/:page' ,component: TasksdatatableComponent },
  { path: 'tasks/form/task', component: FormTaskComponent },
  { path: 'tasks/form/task/:taskId', component: FormTaskComponent },
  { path: 'tasks/form/company/:companyId', component: FormTaskComponent },
  { path: 'tasks/form/employee/:companyId/:employeeId', component: FormTaskComponent },
  { path: 'tasks/form/new/task', component: FormNewTaskComponent },
  { path: 'tasks/form/new/task/:taskId', component: FormNewTaskComponent },
  { path: 'tasks/form/new/company/:companyId', component: FormNewTaskComponent },
  { path: 'tasks/form/new/employee/:companyId/:employeeId', component: FormNewTaskComponent },
  //{ path: 'templates', component: TemplatesComponent },
  //{ path: 'templates/page/:page', component: TemplatesComponent },
  { path: 'informations', component: InformationsComponent },
  { path: 'informations/page/:page', component: InformationsComponent },
  { path: 'informations/view/:id', component: ViewInformationComponent },
  { path: 'informations/form', component: FormInformationComponent },
  { path: 'informations/form/:id', component: FormInformationComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/page/:page', component: EmployeesComponent },
  { path: 'employees/view/:id', component: ViewEmployeeComponent },
  { path: 'employees/form/:companyId', component: FormEmployeeComponent },
  { path: 'employees/form/:companyId/:employeeId', component: FormEmployeeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/page/:page', component: UsersComponent },
  { path: 'users/view/:id', component: ViewUserComponent },
  { path: 'users/form', component: FormUserComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'users/form/:id', component: FormUserComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'company_types', component: CompanyTypesComponent },
  { path: 'company_types/page/:page', component: CompanyTypesComponent },
  { path: 'company_types/form', component: FormCompanyTypeComponent },
  { path: 'company_types/form/:id', component: FormCompanyTypeComponent },
  { path: 'company_types/view/:id', component: ViewCompanyTypeComponent },
  { path: 'zero_config', component: ZeroConfigurationComponent },
  { path: 'tests/TableExpandableRowsExampleComponent', component: TableExpandableRowsExampleComponent },
  { path: 'tests/listitem', component: BaseComponent },

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CompaniesComponent,
    FormCompanyComponent,
    EmployeesComponent,
    RolesComponent,
    TasksComponent,
    //TasksdatatableComponent,
    CompanyTypesComponent,
    ViewCompanyComponent,
    LoginComponent,
    ViewTaskComponent,
    FormTaskComponent,
    PaginatorComponent,
    InformationsComponent,
    UsersComponent,
    ViewEmployeeComponent,
    FormEmployeeComponent,
    ViewInformationComponent,
    FormInformationComponent,
    ViewUserComponent,
    FormUserComponent,
    ViewCompanyTypeComponent,
    FormCompanyTypeComponent,
    //TemplatesComponent,
    ZeroConfigurationComponent,
    //TasksByDeadlineComponent,
    TableExpandableRowsExampleComponent,
    FormNewTaskComponent,
    ListItemComponent,
    BaseComponent,
    //TasksByUserComponent,
    //SubtasksListComponent,
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    DataTablesModule,
    MatSlideToggleModule,
    MatIconModule,
    DragDropModule,
    CommonModule

  ],
  providers:
    [{ provide: LOCALE_ID, useValue: 'ca' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }

    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
