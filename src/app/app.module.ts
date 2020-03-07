import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MaterialModules } from './MaterialModules';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent, DashboardImageDialog } from './Cliente/dashboard/dashboard.component';
import { DataService } from './Services/data.service';
import { AuthGuardService } from './Services/auth-guard.service';
import { NavbarService } from './Services/navbar.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxImageCompressService} from 'ngx-image-compress';
import { FormPedidoComponent, CreateModeloDialog, OrderDetDialog } from './Cliente/form-pedido/form-pedido.component';
import { LoadImageComponent } from './Utilities/load-image/load-image.component';
import { LoadImageService } from './Services/load-image.service';
import { PdfMakeService } from './Services/pdf-make.service';
import { FillOrderComponent } from './Cliente/fill-order/fill-order.component';
import { ClientesComponent, EditClienteDialog } from './Manutencao/clientes/clientes.component';
import { ArtigosComponent, EditArtigoDialog } from './Manutencao/artigos/artigos.component';
import { CoresComponent, EditCorDialog } from './Manutencao/cores/cores.component';
import { ElementosComponent, EditElementoDialog } from './Manutencao/elementos/elementos.component';
import { UtilizadoresComponent, EditUtilizadoresDialog } from './Manutencao/utilizadores/utilizadores.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    DashboardImageDialog,
    FormPedidoComponent,
    CreateModeloDialog,
    LoadImageComponent,
    FillOrderComponent,
    OrderDetDialog,
    ClientesComponent,
    EditClienteDialog,
    ArtigosComponent,
    CoresComponent,
    ElementosComponent,
    UtilizadoresComponent,
    EditArtigoDialog,
    EditCorDialog,
    EditElementoDialog,
    EditUtilizadoresDialog
  ],
  entryComponents: [
    DashboardImageDialog,
    FormPedidoComponent,
    CreateModeloDialog,
    LoadImageComponent,
    OrderDetDialog,
    EditClienteDialog,
    EditArtigoDialog,
    EditCorDialog,
    EditElementoDialog,
    EditUtilizadoresDialog
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModules,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    DataService,
    AuthGuardService,
    NavbarService,
    NgxImageCompressService,
    LoadImageService,
    PdfMakeService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
