import { Component, OnInit } from '@angular/core';
import { DataService } from '../Services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  clientes: any = [];

  constructor(private data: DataService) {
    this.data.getData('clientes').subscribe(
      resp => this.clientes = resp
    );
   }

  ngOnInit() {
  }

}
