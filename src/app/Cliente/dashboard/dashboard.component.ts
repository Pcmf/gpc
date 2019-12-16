import { Component, OnInit, Inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-dash-client',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private id: number;
  cliente: any = [];
  years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  pedidosAberto: any = [];
  pedidosParaAprovacao: any = [];
  pedidosAprovados: any = [];
  pedidosProducao: any = [];
  pedidosFinalizados: any = [];
  pedidos: any = [];
  tab: number;
  autoRefInterna = '';

  displayedColumns: string[] = ['imagem', 'refInterna', 'tema',  'dataPedido', 'dataSituacao'];
  preview: string;

  pedidoIniciado = false;
  newPedidoId = 0;
  private d = new Date();
  year = this.d.getFullYear();
  ano = this.d.getFullYear();
  anos = [this.ano, this.ano + 1];
  selected = new FormControl(1);

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private dialog: MatDialog
  ) {  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.data.getData('clientes/' + this.id).subscribe(
      (resp: any) => {
        if (resp) {
          this.cliente = resp;
          console.table(this.cliente.nome);
          this.loadData(this.id, this.year);
          setTimeout(() => this.selected.setValue(0), 800);
        } else {
          alert('Erro ao carregar cliente. Contacte suporte');
        }
      }
    );
  }

  loadByYear(year) {
    this.loadData(this.id, year);
  }

  loadData(id, year) {
    // Carregar os dados dos pedidos
    // Em Aberto
    this.data.getData('pedidos/' + id + '/' + year + '/1').subscribe(
      (resp1: any) => {
        this.pedidosAberto = resp1;
        // Para Aprovação
        this.data.getData('pedidos/' + id + '/' + year + '/2').subscribe(
          (resp2: any) => {
            this.pedidosParaAprovacao = resp2;
            // Aprovados
            this.data.getData('pedidos/' + id + '/' + year + '/3').subscribe(
              (resp3: any) => {
                this.pedidosAprovados = resp3;
                // Para Produção
                this.data.getData('pedidos/' + id + '/' + year + '/5').subscribe(
                  (resp4: any) => {
                    this.pedidosProducao = resp4;
                    // Em Concluidos
                    this.data.getData('pedidos/' + id + '/' + year + '/6').subscribe(
                      (resp5: any) => {
                        this.pedidosFinalizados = resp5;
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
                );
              }
            );
          }
        );
      }
    );
  }

  reload(){
    this.loadData(this.id, this.year);
  }

  getRefInterna(event) {
    this.data.getData('pedido/ref/' + this.id + '/' + event.value).subscribe(
      (resp: string) => this.autoRefInterna = resp
    );
  }

  editarPedido(pid, tab) {
    console.log(pid + '   -  ' + tab);
    this.newPedidoId = pid;
    this.tab = tab;
    this.pedidoIniciado = true;
    this.selected.setValue(6);
  }

  receiveImage(event) {
    this.preview = event;
  }

  createPedido(form) {
    const obj = {
      anoTema: form.anoTema,
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
          this.preview = '';
          this.year = obj.anoTema;
          this.loadByYear(obj.anoTema);
          this.editarPedido(this.newPedidoId, 4);
        }
      }
    );
  }

  pedidoFechado(event) {
    this.pedidoIniciado = event;
  }
  tabOrigem(event) {
    console.log(event);
    this.selected.setValue(event);
  }


/**
 *
 * Dialog
 */
  openDialog(ln): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(DashboardImageDialog, {
      width: '60%',
      data: ln
     // data: { tema: ln.tema, foto: ln.foto }
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
    @Inject(MAT_DIALOG_DATA) public data,
    private dataService: DataService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  receiveImage(event) {
    this.data.foto = event;
    console.log('atualizar imagem?');
    this.dataService.editData('pedido/' + this.data.id, this.data ).subscribe(
      resp => console.log(resp)
    );
  }

}
