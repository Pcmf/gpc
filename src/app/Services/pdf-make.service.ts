import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DataService } from './data.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfMakeService {
  private cliente: any = [];
  private empresa: any = [];
  private pedido: any = [];
  constructor(private data: DataService) {
    this.data.getData('empresa').subscribe(
      resp => this.empresa = resp
    );


  }


  folhaParaAprovacao(pedido) {
    this.pedido = pedido;
    this.data.getData('clientes/' + this.pedido.clienteId).subscribe(
      respc =>  {
        this.cliente = respc;
        const ddFolhaParaAprovacao = this.get_ddFolhaParaAprovacao() /* { content: 'Tema: ' + pedido.tema  } */;
        pdfMake.createPdf(ddFolhaParaAprovacao).open();
      }
    );

  }


  private get_ddFolhaParaAprovacao() {
    return {
      content: [
        [
          this.get_ddHeader()
        ],
        [
          this.getOther()
        ]


      ]
    };

  }

  private get_ddHeader() {

    return {
      columns: [
        [this.getMyLogo()]
        ,
        [
          {
            width: '*',
            text: 'Tema: ' + this.pedido.tema,
            style: 'bold',
            alignment: 'center'
          },
          {
            image: this.pedido.foto,
            width: 50,
            alignment: 'center'
          }
        ],
        [
          this.getClienteLogo()
        ]
      ]

    };
  }

  private getOther() {
    return {
      columns: [
        {
          // auto-sized columns have their widths based on their content
          width: 'auto',
          text: 'First column'
        },
        {
          // star-sized columns fill the remaining space
          // if there's more than one star-column, available width is divided equally
          width: '*',
          text: 'Second column'
        },
        {
          // fixed width
          width: 100,
          text: 'Third column'
        }
      ]
    };
  }

  getMyLogo() {
    if (this.empresa.logotipo) {
      return {
        image: this.empresa.logotipo,
        width: 75,
        alignment: 'left'
      };
    }
    return null;
  }

  getClienteLogo() {
    if (this.cliente.imagem) {
      return {
        image: this.cliente.imagem,
        width: 75,
        alignment: 'right'
      };
    }
    return null;
  }



}



