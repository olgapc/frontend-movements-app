import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
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
import { MatMomentDateModule } from '@angular/material-moment-adapter';


registerLocaleData(localeCa, 'ca');

const routes: Routes =[
  {path: '', redirectTo: '/companies', pathMatch: 'full'},
  {path: 'directivas', component: DirectivaComponent},
  {path: 'companies', component: CompaniesComponent},
  {path: 'companies/form', component: FormComponent, canActivate:[AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'companies/form/:id', component: FormComponent, canActivate:[AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}}//,
  //{path: 'companies/view/:id', component: ViewComponent}
  ,{path: 'login', component: LoginComponent},
  {path: 'tasks/:id', component: ViewTaskComponent},
  {path: 'tasks', component: TasksComponent},
  {path: 'tasks/form/:companyId', component: FormTaskComponent},
  {path: 'tasks/form/:companyId/:employeeId', component: FormTaskComponent},
  {path: 'tasks/form', component: FormTaskComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    CompaniesComponent,
    FormComponent,
    EmployeesComponent,
    RolesComponent,
    TasksComponent,
    CompanyTypesComponent,
    ViewComponent,
    LoginComponent,
    ViewTaskComponent,
    FormTaskComponent
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
    MatMomentDateModule

  ],
  providers:
  [{provide:LOCALE_ID, useValue: 'ca'},
  {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true},
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true},

],
  bootstrap: [AppComponent]
})
export class AppModule { }
