import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

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
  filesize: number;

  constructor(
    private data: DataService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
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

  editarModelo(mod) {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(CreateModeloDialog, {
      data: { pedido: this.pedido, modelo: mod }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.data.getData('modelos/' + this.pedidoId).subscribe(
        resp => this.modelos = resp
      );
    });
  }


  addModeloDialog() {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(CreateModeloDialog, {
      data: { pedido: this.pedido, modelo: [], create: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.data.getData('modelos/' + this.pedidoId).subscribe(
        resp => this.modelos = resp
      );
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
  preview: string;
  artigos: any = [];
  escalas: any = [];
  modelo: any = [];
  autoRefInterna = '';

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dados,
    private data: DataService
  ) {

    if (!dados.create) {
      console.log(dados.create);
      this.modelo = dados.modelo;
      this.preview = this.modelo.foto;
      console.table(this.modelo);
    } else {
      // obter refInterna
      console.log(dados.create);
      this.data.getData('modelos/ref/' + dados.pedido.id).subscribe(
        resp => this.modelo.refinterna = resp
      );
    }

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
    if (this.dados.create) {
      const obj = { pedido: this.dados.pedido, formulario: form, foto: this.preview };
      this.data.saveData('modelos', obj).subscribe(
        resp => {
          form.foto = this.preview;
          this.dialogRef.close(form);
        }
      );
    } else {
      // Editar Modelo
      const obj = { pedido: this.dados.pedido, formulario: form, foto: this.preview };
      this.data.editData('modelo/' + this.modelo.id, obj).subscribe(
        resp => {
          console.log(resp);
          form.foto = this.preview;
          this.dialogRef.close(form);
        }
      );
    }

  }
  // Fechar o Dialog
  onNoClick(): void {
    this.dialogRef.close();
  }

}

