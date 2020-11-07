import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { CompaniesComponent } from './companies/companies.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormComponent } from './companies/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeCa from '@angular/common/locales/ca';
import { EmployeesComponent } from './employees/employees.component';
import { RolesComponent } from './roles/roles.component';
import { TasksComponent } from './tasks/tasks.component';
import { CompanyTypesComponent } from './company-types/company-types.component';
import { ViewComponent } from './companies/view/view.component';
import { LoginComponent } from './users/login.component';
import { AuthGuard } from './users/guards/auth.guard';
import { RoleGuard } from './users/guards/role.guard';
import { TokenInterceptor } from './users/interceptors/token.interceptor';
import { AuthInterceptor } from './users/interceptors/auth.interceptor';
import { ViewTaskComponent } from './tasks/view-task.component';
import { FormTaskComponent } from './tasks/form-task.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { InformationsComponent } from './tasks/informations.component';
import { UsersComponent } from './users/users.component';
import { ViewEmployeeComponent } from './employees/view-employee.component';
import { FormEmployeeComponent } from './employees/form-employee.component';
import { ViewInformationComponent } from './tasks/view-information/view-information.component';
import { FormInformationComponent } from './tasks/form-information.component';



registerLocaleData(localeCa, 'ca');

const routes: Routes =[
  {path: '', redirectTo: '/companies', pathMatch: 'full'},
  {path: 'companies', component: CompaniesComponent},
  {path: 'companies/page/:page', component: CompaniesComponent},
  {path: 'companies/form', component: FormComponent, canActivate:[AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'companies/form/:id', component: FormComponent, canActivate:[AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}}//,
  //{path: 'companies/view/:id', component: ViewComponent}
  ,{path: 'login', component: LoginComponent},
  {path: 'tasks/:id', component: ViewTaskComponent},
  {path: 'tasks', component: TasksComponent},
  {path: 'tasks/page/:page', component: TasksComponent},
  //{path: 'tasks/form/:companyId', component: FormTaskComponent},
  //{path: 'tasks/form/:companyId/:employeeId', component: FormTaskComponent},
  //{path: 'tasks/form/task/:taskId', component: FormTaskComponent},
  {path: 'tasks/form/task', component: FormTaskComponent},
  {path: 'tasks/form/task/:idTask', component: FormTaskComponent},
  {path: 'tasks/form/company/:idCompany', component: FormTaskComponent},
  {path: 'tasks/form/employee/:idCompany/:idEmployee', component: FormTaskComponent},
  {path: 'informations', component: InformationsComponent},
  {path: 'informations/page/:page', component: InformationsComponent},
  {path: 'informations/:id', component: ViewInformationComponent},
  {path: 'informations/form', component: FormInformationComponent},
  {path: 'informations/form/:id', component: FormInformationComponent},
  {path: 'employees', component: EmployeesComponent},
  {path: 'employees/page/:page', component: EmployeesComponent},
  {path: 'employees/:id', component: ViewEmployeeComponent},
  {path: 'employees/form/:companyId', component: FormEmployeeComponent},
  {path: 'employees/form/:companyId/:employeeId', component: FormEmployeeComponent},
  {path: 'users', component: UsersComponent},
  {path: 'users/page/:page', component: UsersComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CompaniesComponent,
    FormComponent,
    EmployeesComponent,
    RolesComponent,
    TasksComponent,
    CompanyTypesComponent,
    ViewComponent,
    LoginComponent,
    ViewTaskComponent,
    FormTaskComponent,
    PaginatorComponent,
    InformationsComponent,
    UsersComponent,
    ViewEmployeeComponent,
    FormEmployeeComponent,
    ViewInformationComponent,
    FormInformationComponent
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
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule

  ],
  providers:
  [{provide:LOCALE_ID, useValue: 'ca'},
  {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true},
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true},
  {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}

],
  bootstrap: [AppComponent]
})
export class AppModule { }
