import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { Location } from '@angular/common';
import { PdfMakeService } from './../../Services/pdf-make.service';

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


  constructor(private route: ActivatedRoute,
              private data: DataService,
              private location: Location,
              private pdfService: PdfMakeService
             ) {
        this.pedidoId = this.route.snapshot.params.id;
        this.data.getData('cores').subscribe(
          respa => this.cores = respa
        );
        this.data.getData('elementos').subscribe(
          respb => this.elementos = respb
        );
        this.data.getData('escalas').subscribe(
          respc => this.escalas = respc
        );
        this.data.getData('pedido/' + this.pedidoId).subscribe(
          respd => this.pedido = respd
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
    this.data.getData('detalhe/' + this.pedidoId + '/' + modelo.modelo.id).subscribe(
      resp => {
        this.detLines = resp;
        this.getTotalQtys();
      }
    );
  }

  getTotalQtys() {
    let total = 0;
    this.detLines.forEach(el => {
      this.tamanhos.forEach( t => {
        !el.qtys[t] ? total = total : total += +el.qtys[t];
      });
    } );
    this.totalByModelo = total;
  }

  // Alterar a imagem do visualizador
  changeLargePic(pic) {
    this.largePic = pic;
  }

  // Guardar uma linha para a DB
  saveLine(ln, index) {
    if (ln.linha) {
      // atualiza linha
      this.data.editData('detalhe/' + this.pedidoId + '/' + ln.modelo + '/' + ln.linha  , ln).subscribe(
        resp => {
          this.getTotalQtys();
        }
      );
    } else {
      // Insere linha
      this.data.saveData('detalhe/' + this.pedidoId + '/' + ln.modelo, ln).subscribe(
        resp => {
            ln.linha = resp;
            this.getTotalQtys();
        }
    );
    }

  }

  // guardar novo preço de modelo
  savePrice(preco) {
      this.modeloSelected.modelo.preco = preco;
      this.saveChanges();
  }

  saveChanges() {
    this.data.editData('modelo/' + this.modeloSelected.modelo.id, this.modeloSelected.modelo).subscribe(
      resp => console.log(resp)
    );
  }

  addLine() {
    // tslint:disable-next-line:one-variable-per-declaration
    const linha = {pedido: this.pedidoId, modelo: this.modeloSelected.modelo.id, linha: '',
            cor1: '',
            cor2: '',
            elem1: '',
            elem1cor: '',
            elem2: '',
            elem2cor: '',
            elem3: '',
            elem3cor: '',
            qtys: {} };

    this.detLines.push(linha);
  }

  deleteLine(ln) {
    this.data.deleteData('detalhe/' + ln.pedido + '/' + ln.modelo + '/' + ln.linha).subscribe(
      resp => {
        console.log(resp);
        this.changeSelectedModel(this.modeloSelected);
      }
    );
  }

  cancel() {
    this.location.back();
  }

  sendToProduction() {
    this.pdfService.folhasParaProducao(this.pedido);
  }


}
