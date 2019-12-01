import { Component, OnInit, OnDestroy } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DataService } from '../Services/data.service';
import { NavbarService } from '../Services/navbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy{
  loginName: any;
  status: number;
  private helper = new JwtHelperService();
  public isCollapsed = true;

  constructor(private data: DataService, private navService: NavbarService, private router: Router) {

    if (sessionStorage.getItem('token') != null) {
      this.loginName = this.helper.decodeToken(sessionStorage.getItem('token')).nome;
      this.status = this.helper.decodeToken(sessionStorage.getItem('token')).sts;

    } else {
      this.navService.navstate$.subscribe((state: any) => this.loginName = state.nome);
      this.navService.navstate$.subscribe((state: any) => this.status = state.sts);

    }


  }

  logout() {
     this.data.logout();
   }

   ngOnDestroy() {
     this.logout();
   }

  isLoggedIn() {
      const token = sessionStorage.getItem('token');
      if ( token ) {  // && this.helper.isTokenExpired(token)
        return true;
      } else {
        return false;
      }
  }


}

