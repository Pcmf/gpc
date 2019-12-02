import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { NavbarService } from './navbar.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private helper = new JwtHelperService();
  private ADDRESS = environment.Address;
  private header: any;

  constructor(
    private http: HttpClient,
    private navbarService: NavbarService
  ) { }

  private getHeaders() {
    return this.header = {
      headers: new HttpHeaders()
        .set('token', this.getToken())
    };
  }

  getData(params) {
    return this.http.get(this.ADDRESS + params, this.getHeaders());
  }


  saveData(path: string, obj: any) {
    return this.http.post(this.ADDRESS + path, JSON.stringify(obj), this.getHeaders());
    // incluir uma forma de notificar que os dados foram inseridos ou erro
  }

  editData(path: string, obj: any) {
    return this.http.put(this.ADDRESS + path, JSON.stringify(obj), this.getHeaders());
    // incluir uma forma de notificar que os dados foram inseridos ou erro
  }

  deleteData(path: string) {
    return this.http.delete(this.ADDRESS + path, this.getHeaders());
  }

  uploadImage(path: string, obj: any){
    return this.http.post(this.ADDRESS + path, obj);
  }

  checkuser(credenciais) {
    return this.http.post(this.ADDRESS + 'auth',
      JSON.stringify(credenciais))
      .pipe(
        map((response: any) => {
          if (response) {
            sessionStorage.setItem('token', response);
            this.navbarService.setNavState(this.helper.decodeToken(response));
            return true;
          } else {
            return false;
          }
        })

      );
  }




  isLoggedIn() {
    return true;
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  logout() {
    sessionStorage.removeItem('token');
  }
}

