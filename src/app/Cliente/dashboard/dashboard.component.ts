import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-dash-client',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private id: number;
  cliente: any = [];
  years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030 ];
  year: number;
  pedidosAberto: any = [];
  pedidosParaAprovacao: any = [];
  pedidosAprovados: any = [];
  pedidosProducao: any = [];
  pedidosFinalizados: any = [];

  displayedColumns: string[] = ['refInterna', 'imagem', 'tema', 'dataPedido', 'dataSituacao'];

  constructor(private route: ActivatedRoute, private data: DataService) {

    this.id = this.route.snapshot.params.id;
    this.data.getData('clientes/' + this.id).subscribe(
      (resp: any) => {
        if (resp) {
          this.cliente = resp;
          this.loadData(this.id, this.year);
        } else {
          alert('Erro ao carregar cliente. Contacte suporte');
        }
      }
    );
  }

  loadByYear(year){
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
      (resp: any) => this.pedidosFinalizados = resp
    );
  }

  ngOnInit() {
    const d = new Date();
    this.year = d.getFullYear();
  }

}
