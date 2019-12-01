import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private loginService: DataService,
              private router: Router) { }

  canActivate() {
    if (this.loginService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
