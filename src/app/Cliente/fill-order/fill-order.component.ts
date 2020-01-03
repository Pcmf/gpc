import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-fill-order',
  templateUrl: './fill-order.component.html',
  styleUrls: ['./fill-order.component.scss']
})
export class FillOrderComponent implements OnInit {
  pedidoId: number;
  modelos: any = [];
  pedido: any = [];
  modeloSelected: any = [];
  modeloSelectedFotos: any = [];
  largePic: string;
  cores: any = [];
  elementos: any = [];
  escalas: any = [];
  tamanhos: string[];
  detLines: any = [];
  totalByModelo: number;


  constructor(private route: ActivatedRoute, private data: DataService) {
    this.pedidoId = this.route.snapshot.params.id;
    this.data.getData('cores').subscribe(
      respc => this.cores = respc
    );
    this.data.getData('elementos').subscribe(
      respc => this.elementos = respc
    );
    this.data.getData('escalas').subscribe(
      respc => this.escalas = respc
    );
    this.data.getData('pedido/' + this.pedidoId).subscribe(
      respp => this.pedido = respp
    );
    this.data.getData('modelos/allimgs/' + this.pedidoId).subscribe(
      resp => {
        this.modelos = resp;
        this.changeSelectedModel(this.modelos[0]);
      }
    );
  }

  ngOnInit() {
  }

  // Alterar o modelo selecionado
  changeSelectedModel(modelo) {
    this.modeloSelected = modelo;
    this.modeloSelected.eskala = this.escalas[this.modeloSelected.modelo.escala - 1];
    this.tamanhos = (this.escalas[this.modeloSelected.modelo.escala - 1]).tamanhos.split(',');
    this.largePic = modelo.modelo.foto;
    this.data.getData('detpedcor/' + this.pedidoId + '/' + modelo.modelo.id).subscribe(
      resp => {
        this.detLines = resp;
        console.log(this.detLines[0].qtys);
      }
    );
  }

  // Alterar a imagem do visualizador
  changeLargePic(pic) {
    this.largePic = pic;
  }

  // Guardar uma linha para a DB
  saveLine(ln, index) {
    // console.log(ln.linha);
    this.data.editData('detpedcor/' + this.pedidoId + '/' + ln.modelo + '/' + index, ln).subscribe(
      resp => ln.linha = resp
    );
  }

  addLine() {
    // tslint:disable-next-line:one-variable-per-declaration
    const linha = {pedido: this.pedidoId, modelo: this.modeloSelected.modelo.id, linha: '',
            cor1: '',
            cor2: '',
            elem1: {elem: '', cor: ''},
            elem2: {elem: '', cor: ''},
            elem3: {elem: '', cor: ''},
            qtys: {}, };

    this.detLines.push(linha);
  }

  deleteLine(ln) {
    this.data.deleteData('detpedcor/' + ln.pedido + '/' + ln.modelo + '/' + ln.linha).subscribe(
      resp => {
        console.log(resp);
        this.changeSelectedModel(this.modeloSelected);
      }
    );
  }


}
