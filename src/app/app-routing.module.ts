import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './Services/auth-guard.service';
import { DashboardComponent } from './Cliente/dashboard/dashboard.component';

const routes: Routes = [
  {path: 'cliente/:id', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],



exports: [RouterModule]
})
export class AppRoutingModule { }
