import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './Services/auth-guard.service';
import { DashboardComponent } from './Cliente/dashboard/dashboard.component';
import { FormPedidoComponent } from './Cliente/form-pedido/form-pedido.component';
import { FillOrderComponent } from './Cliente/fill-order/fill-order.component';
import { ClientesComponent } from './Manutencao/clientes/clientes.component';
import { ArtigosComponent } from './Manutencao/artigos/artigos.component';
import { CoresComponent } from './Manutencao/cores/cores.component';
import { ElementosComponent } from './Manutencao/elementos/elementos.component';
import { UtilizadoresComponent } from './Manutencao/utilizadores/utilizadores.component';

const routes: Routes = [
  {path: 'clientes', component: ClientesComponent, canActivate: [AuthGuardService]},
  {path: 'artigos', component: ArtigosComponent, canActivate: [AuthGuardService]},
  {path: 'cores', component: CoresComponent, canActivate: [AuthGuardService]},
  {path: 'elementos', component: ElementosComponent, canActivate: [AuthGuardService]},
  {path: 'utilizadores', component: UtilizadoresComponent, canActivate: [AuthGuardService]},
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
