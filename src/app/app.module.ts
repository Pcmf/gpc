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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    DashboardImageDialog
  ],
  entryComponents: [
    DashboardImageDialog
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
    NavbarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
