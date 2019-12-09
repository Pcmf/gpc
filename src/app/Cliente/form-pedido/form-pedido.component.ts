import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ActivatedRoute } from '@angular/router';
import { LoadImageService } from '../../Services/load-image.service';
import { timeout } from 'q';

@Component({
  selector: 'app-form-pedido',
  templateUrl: './form-pedido.component.html',
  styleUrls: ['./form-pedido.component.scss']
})
export class FormPedidoComponent implements OnInit {
  @Input() pedidoId: number;
  @Input() tab: number;
  @Output() pedidoIniciado = new EventEmitter<boolean>();
  @Output() tabOrigem = new EventEmitter<number>();
  pedido: any = [];
  modelos: any = [];
  FormPedidoColunas: string[] = ['refinterna', 'refcliente', 'nome', 'imagem'];
  id: number;



  constructor(private data: DataService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private loadImageService: LoadImageService
              ) {
    console.log(this.pedidoId);
    this.pedidoId = this.route.snapshot.params.id;

  }

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

  openLoadImage(event) {
    const img = this.loadImageService.handleInputChange(event);
    setTimeout(() => console.log(img), 2000);

  }

  openModeloDialog() {
    // tslint:disable-next-line: no-use-before-declare
    this.dialog.open(CreateModeloDialog, {
      data: this.pedido
    });
  }

  cancelarCriar() {
    this.pedidoIniciado.emit(false);
    this.tabOrigem.emit(this.tab);
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

  constructor(public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public pedido: any[],
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

  receiveImage(event) {
    this.preview = event;
  }

  saveModelo(form) {
    const obj = {pedido: this.pedido, formulario: form, foto: this.preview }
    this.data.saveData('modelos', obj).subscribe(
      resp => {
        console.log(resp);
      }
    );
  }
  // Fechar o Dialog
  onNoClick(): void {
    this.dialogRef.close();
  }

}
