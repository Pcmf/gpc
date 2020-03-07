import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfMakeService } from './../../Services/pdf-make.service';
import { RefInternaService } from 'src/app/Services/ref-interna.service';

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
  @Output() reload = new EventEmitter<boolean>();
  pedido: any = [];
  modelos: any = [];
  FormPedidoColunas: string[] = ['refinterna', 'refcliente', 'nome', 'imagem', 'star'];
  id: number;
  filesize: number;

  constructor(
    private data: DataService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private pdfService: PdfMakeService,
    private router: Router
  ) {
    this.pedidoId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.data.getData('pedido/' + this.pedidoId).subscribe(
      resp => {
        this.pedido = resp;
      }
    );
    this.getModelos();
  }

  private getModelos() {
    this.data.getData('modelos/' + this.pedidoId).subscribe(
      respM => {
        this.modelos = respM;
        console.log(this.modelos.length);
      }
    );
  }

  editPedido(pedido) {
    this.data.editData('pedido/' + pedido.id, pedido).subscribe(
      resp => {
        console.log(resp);
        this.reload.emit(true);
      }
    );
  }

  editarModelo(mod) {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(CreateModeloDialog, {
      data: { pedido: this.pedido, modelo: mod }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getModelos();
    });
  }


  addModeloDialog() {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(CreateModeloDialog, {
      data: { pedido: this.pedido, modelo: [], create: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getModelos();
    });
  }

  orderDetDialog(element) {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(OrderDetDialog, {
      data: { pedido: this.pedido, modelo: element },
      maxWidth: '100vw !important'});
    dialogRef.afterClosed().subscribe(result => {
      this.getModelos();
    });
  }

  sair() {
    this.pedidoIniciado.emit(false);
    this.tabOrigem.emit(this.tab);
  }

  deletePedido(pedido) {
    if (confirm('Vai eleminar este tema e todos os modelos. Confirma?')) {
      this.data.deleteData('pedido/' + pedido.id).subscribe(
        resp => {
          console.log(resp);
          this.reload.emit(true);
          this.pedidoIniciado.emit(false);
          this.tabOrigem.emit(this.tab);
        }
      );
    }
  }

  deleteModelo(modelo) {
    if (confirm('Vai eleminar este modelo. Confirma?')) {
      this.data.deleteData('modelo/' + modelo.id).subscribe(
        resp => {
          this.getModelos();
        }
      );
    }
  }

  // OPERAÇÕES SOBRE O PEDIDO

  fecharParaAprovacao(pedido) {
   // alert('imprimir as folhas para o pedido' + pedido.id);
    this.pdfService.folhaParaAprovacao(pedido);
    pedido.situacao = 2;
    this.editPedido(pedido);
    setTimeout(() => {
        this.pedidoIniciado.emit(false);
        this.tabOrigem.emit(this.tab);
        this.reload.emit(true);
    }, 1000);

  }

  aprovado(pedido) {
    // alert('Registar os detalhes do pedido. Quantidades e cores.');
    this.router.navigate(['fillPedido/', pedido.id ]);
  }

  recusado(pedido) {
    alert('marcar como recusado');
  }

  paraProducao(pedido) {
    this.pdfService.folhasParaProducao(this.pedido);
    // Change status to "para produção"
    this.pedido.situacao = 5;
    this.data.editData('pedido/' + this.pedido.id, this.pedido ).subscribe(
      resp => {
        console.log(resp);
        this.reload.emit(true);
        this.pedidoIniciado.emit(false);
        this.tabOrigem.emit(this.tab);
      }
    );
  }

  concluido(pedido) {
    this.pedido.situacao = 6;
    this.data.editData('pedido/' + this.pedido.id, this.pedido ).subscribe(
      resp => {
        this.reload.emit(true);
        this.pedidoIniciado.emit(false);
        this.tabOrigem.emit(this.tab);
      }
    );
  }

  reproducao(pedido) {
    alert('copiar como novo pedido. Por fazer');
  }
}

/**
 * Dialog para criar modelo
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'create-modelo-dialog',
  templateUrl: 'create-modelo-dialog.html',
  styleUrls: ['create-modelo-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class CreateModeloDialog {
  preview: string;
  images: any = [];
  artigos: any = [];
  escalas: any = [];
  modelo: any = [];
  autoRefInterna = '';

  constructor(private refService: RefInternaService, 
              public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public dados,
              private data: DataService
  ) {

    if (!dados.create) {
      this.modelo = dados.modelo;
      this.preview = this.modelo.foto;
      this.data.getData('modelos/fotos/' + this.modelo.id).subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        (resp: any[]) => resp.map((element) => {
          return this.images.push(element.foto);
        })
      );
    } else {
      // obter refInterna
      this.refService.getNewRef(dados.pedido.clienteId, dados.pedido.ano).subscribe(
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

  receiveOtherImages(event) {
    this.images.push(event);
    const img = [event];
    if (this.modelo.id) {
      this.data.editData('modelos/fotos/' + this.modelo.id, img).subscribe(
        resp => console.log(resp)
      );
    }
  }

  saveModelo(form) {
    if (this.dados.create) {
      const obj = { pedido: this.dados.pedido, formulario: form, foto: this.preview };
      this.data.saveData('modelos', obj).subscribe(
        resp => {
          this.data.editData('modelos/fotos/' + +resp, this.images).subscribe(
            res => {
              console.log(res);
              form.foto = this.preview;
              this.dialogRef.close(form);
            }
          );
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


/**
 * Dialog para editar qty tamanhos
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'order-det-dialog',
  templateUrl: './order-det-dialog.html',
  styleUrls: ['./order-det-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class OrderDetDialog {
  pedidoId: number;
  pedido: any = [];
  modelo: any = [];
  modeloSelectedFotos: any = [];
  largePic: string;
  cores: any = [];
  elementos: any = [];
  escalas: any = [];
  tamanhos: string[];
  detLines: any = [];
  imgs: any = [];
  totalByModelo: number;

  constructor(private data: DataService,
              private pdfService: PdfMakeService,
              public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public dados
  ) {
    this.modelo = dados.modelo;
    this.pedido = dados.pedido;
    this.pedidoId = this.pedido.id;

    this.data.getData('cores').subscribe(
      respa => this.cores = respa
    );
    this.data.getData('elementos').subscribe(
      respb => this.elementos = respb
    );
    this.data.getData('escalas').subscribe(
      respc => {
        this.escalas = respc;

        this.tamanhos = (this.escalas[this.modelo.escala - 1]).tamanhos.split(',');
        this.largePic = this.modelo.foto;
        this.getData();
      }
    );
  }

  getData() {
    this.data.getData('detalhe/' + this.pedidoId + '/' + this.modelo.id).subscribe(
      resp => {
        this.detLines = resp;
        this.getTotalQtys();
      }
    );
  }

  getTotalQtys() {
    let total = 0;
    this.detLines.forEach(el => {
      this.tamanhos.forEach(t => {
        !el.qtys[t] ? total = total : total += +el.qtys[t];
      });
    });
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
      this.data.editData('detalhe/' + this.pedidoId + '/' + ln.modelo + '/' + ln.linha, ln).subscribe(
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
    this.modelo.preco = preco;
    this.saveChanges();
  }

  saveChanges() {
    this.data.editData('modelo/' + this.modelo.id, this.modelo).subscribe(
      resp => console.log(resp)
    );
  }

  addLine() {
    // tslint:disable-next-line:one-variable-per-declaration
    const linha = {
      pedido: this.pedidoId, modelo: this.modelo.id, linha: '',
      cor1: '',
      cor2: '',
      elem1: '',
      elem1cor: '',
      elem2: '',
      elem2cor: '',
      elem3: '',
      elem3cor: '',
      qtys: {}
    };

    this.detLines.push(linha);
  }

  deleteLine(ln) {
    this.data.deleteData('detalhe/' + ln.pedido + '/' + ln.modelo + '/' + ln.linha).subscribe(
      resp => {
        console.log(resp);
        this.getData();
       // this.changeSelectedModel(this.modelo);
      }
    );
  }

  cancel() {
    // this.location.back();
    this.dialogRef.close();
  }

  printFolhas() {
    alert('Imprimir Folhas');
    this.pdfService.folhasParaProducaoModelo(this.modelo);
  }

}
