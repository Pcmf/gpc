import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-form-pedido',
  templateUrl: './form-pedido.component.html',
  styleUrls: ['./form-pedido.component.scss']
})
export class FormPedidoComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input('pedidoId') pedidoId: number;
  pedido: any = [];
  modelos: any = [];
  FormPedidoColunas: string[] = ['refInterna', 'refCliente', 'nome', 'imagem'];

  constructor(private data: DataService) {
    console.log(this.pedidoId);
    this.data.getData('pedidos/' + this.pedidoId).subscribe(
      resp => {
        this.pedido = resp;
      }
    );
    this.data.getData('modelos/' + this.pedidoId).subscribe(
      respM => this.modelos = respM
    );

  }

  ngOnInit() {
    console.log(this.pedidoId);
  }

}
