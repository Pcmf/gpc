import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../Services/navbar.service';
import { Router } from '@angular/router';
import { DataService } from '../Services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private state: any;
  hide = true;

  constructor(private router: Router, private navbarService: NavbarService, private dataService: DataService) {
    this.navbarService.navstate$.subscribe(
      (state: any) => this.state = state
    );
  }

  ngOnInit() {
  }

  login(credenciais) {

    this.dataService.checkuser(credenciais)
      .subscribe(
        (response: any) => {
          if (response) {
            setTimeout(() => {
              console.log(response);
              this.router.navigate(['home/']);
            }, 100);

          }
        }
      );
  }


}
