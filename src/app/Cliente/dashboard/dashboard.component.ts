import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {NgxImageCompressService} from 'ngx-image-compress';

@Component({
  selector: 'app-dash-client',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private id: number;
  cliente: any = [];
  years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
/*   year: number;
  anos: number [];
  ano: number; */
  pedidosAberto: any = [];
  pedidosParaAprovacao: any = [];
  pedidosAprovados: any = [];
  pedidosProducao: any = [];
  pedidosFinalizados: any = [];
  pedidos: any = []

  displayedColumns: string[] = ['refInterna', 'imagem', 'tema', 'dataPedido', 'dataSituacao'];

  private filetype: string;
  private filename: string;
  preview: string;
  private filesize: number;

  pedidoIniciado = false;
  newPedidoId = 0;
  private d = new Date();
  year = this.d.getFullYear();
  ano = this.d.getFullYear();
  anos = [this.ano, this.ano + 1];


  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private dialog: MatDialog,
    private imageCompress: NgxImageCompressService
  ) {
    this.id = this.route.snapshot.params.id;
    this.data.getData('clientes/' + this.id).subscribe(
      (resp: any) => {
        if (resp) {
          this.cliente = resp;
          console.table(this.cliente.nome);
          this.loadData(this.id, this.year);
        } else {
          alert('Erro ao carregar cliente. Contacte suporte');
        }
      }
    );
  }

  ngOnInit() {

  }

  loadByYear(year) {
    this.loadData(this.id, year);
  }

  loadData(id, year) {
    // Carregar os dados dos pedidos
    // Em Aberto
    this.data.getData('pedidos/' + id + '/' + year + '/1').subscribe(
      (resp: any) => this.pedidosAberto = resp
    );
    // Para Aprovação
    this.data.getData('pedidos/' + id + '/' + year + '/2').subscribe(
      (resp: any) => this.pedidosParaAprovacao = resp
    );
    // Aprovados
    this.data.getData('pedidos/' + id + '/' + year + '/3').subscribe(
      (resp: any) => this.pedidosAprovados = resp
    );
    // Para Produção
    this.data.getData('pedidos/' + id + '/' + year + '/5').subscribe(
      (resp: any) => this.pedidosProducao = resp
    );
    // Em Concluidos
    this.data.getData('pedidos/' + id + '/' + year + '/6').subscribe(
      (resp: any) => {
        this.pedidosFinalizados = resp;
        this.pedidos = [
          { nome: 'Pedidos em Aberto', list: this.pedidosAberto },
          { nome: 'Pedidos para Aprovação', list: this.pedidosParaAprovacao },
          { nome: 'Pedidos Aprovados', list: this.pedidosAprovados },
          { nome: 'Pedidos em Produção', list: this.pedidosProducao },
          { nome: 'Pedidos Concluidos', list: this.pedidosFinalizados }
        ];
      }
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
    if (this.filesize > 30000){
    this.imageCompress.compressFile(reader.result, 1, 50, 80).then(
        resp => {
            this.preview = resp;
          }

      );
    } else {
      this.preview = reader.result;
    }

  }

  createPedido(form) {
    const obj = {
                  anoTema : form.anoTema,
                  tema: form.tema,
                  refCliente: form.refcliente,
                  descricao: form.descricao,
                  foto: this.preview
                };

    this.data.editData('pedidos/' + this.id, obj).subscribe(
      resp => {
        if (+resp > 0) {
          this.newPedidoId = +resp;
          this.pedidoIniciado = true;
          console.log('Novo pedido ' + this.newPedidoId);
          this.year = obj.anoTema;
          this.loadByYear(obj.anoTema);
        }
      }
    );
  }




  openDialog(ln): void {
    console.log(ln);
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(DashboardImageDialog, {
      width: '60%',
      data: { tema: ln.tema, foto: ln.foto }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dashboard-image-dialog',
  templateUrl: 'dashboard-image-dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class DashboardImageDialog {

  constructor(
    public dialogRef: MatDialogRef<DashboardImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any[]) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
