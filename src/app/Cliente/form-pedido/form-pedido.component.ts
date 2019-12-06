import { Component, OnInit, Input, Inject } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgxImageCompressService } from 'ngx-image-compress';
@Component({
  selector: 'app-form-pedido',
  templateUrl: './form-pedido.component.html',
  styleUrls: ['./form-pedido.component.scss']
})
export class FormPedidoComponent implements OnInit {
  @Input() pedidoId: number;
  pedido: any = [];
  modelos: any = [];
  FormPedidoColunas: string[] = ['refInterna', 'refCliente', 'nome', 'imagem'];

  ngOnInit() {
    console.log(this.pedidoId);
    this.data.getData('pedido/' + this.pedidoId).subscribe(
      resp => {
        this.pedido = resp;
      }
    );
    this.data.getData('modelos/' + this.pedidoId).subscribe(
      respM => this.modelos = respM
    );
  }

  constructor(private data: DataService, private dialog: MatDialog) {
    console.log(this.pedidoId);


  }

  openModeloDialog() {
    // tslint:disable-next-line: no-use-before-declare
    this.dialog.open(CreateModeloDialog, {
      data: this.pedido
    });
  }

  goBack() {
    alert('Go back');
  }

  deletePedido() {
    alert('Apagar pedido e modelos');
  }

}
/**
 * Dialog para criar modelo
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'create-modelo-dialog',
  templateUrl: 'create-modelo-dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class CreateModeloDialog {
  private filetype: string;
  private filename: string;
  preview: string;
  private filesize: number;
  artigos: any = [];
  escalas: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public pedido: any[],
              private data: DataService,
              private imageCompress: NgxImageCompressService
  ) {
    this.data.getData('artigos').subscribe(
      resp => this.artigos = resp
    );
    this.data.getData('escalas').subscribe(
      resp => this.escalas = resp
    );
  }


  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    this.filetype = (file.type).substr((file.type).indexOf('/') + 1);
    this.filename = file.name;
    this.filesize = file.size;
    const pattern2 = /image-*/;
    const reader = new FileReader();

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);

  }
  _handleReaderLoaded(e) {
    const reader = e.target;
    if (this.filesize > 30000) {
      this.imageCompress.compressFile(reader.result, 1, 50, 80).then(
        resp => {
          this.preview = resp;
        }

      );
    } else {
      this.preview = reader.result;
    }

  }

  saveModelo(form) {
    const obj = {pedido: this.pedido, formulario: form, foto: this.preview }
    this.data.saveData('modelos', obj).subscribe(
      resp => {
        console.log(resp);
      }
    );
  }

}
