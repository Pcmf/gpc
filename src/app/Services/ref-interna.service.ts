import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class RefInternaService {

  constructor(private dataService: DataService) {

  }

  getNewRef(client: number, ano: number) {
    // obter a ultima referencia do cliente, se existir e adiciona uma unidade
    return this.dataService.getData('refint/' + client + '/' + ano);
  }
}
