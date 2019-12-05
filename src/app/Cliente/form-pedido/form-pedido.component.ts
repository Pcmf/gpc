import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';

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

  constructor(private data: DataService) {
    console.log(this.pedidoId);


  }

  addModelo() {
    alert('Adicionar modelo');
  }

  goBack() {
    alert('Go back');
  }

  deletePedido() {
    alert('Apagar pedido e modelos');
  }

}
