import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './Services/auth-guard.service';
import { DashboardComponent } from './Cliente/dashboard/dashboard.component';
import { FormPedidoComponent } from './Cliente/form-pedido/form-pedido.component';
import { FillOrderComponent } from './Cliente/fill-order/fill-order.component';

const routes: Routes = [
  {path: 'fillPedido/:id', component: FillOrderComponent, canActivate: [AuthGuardService]},
  {path: 'detPedido/:id', component: FormPedidoComponent, canActivate: [AuthGuardService]},
  {path: 'cliente/:id', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],



exports: [RouterModule]
})
export class AppRoutingModule { }
