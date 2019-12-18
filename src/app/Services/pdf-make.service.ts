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
  constructor(private data: DataService) { }


  folhaParaAprovacao(pedido) {
    const ddFolhaParaAprovacao = this.get_ddFolhaParaAprovacao(pedido) /* { content: 'Tema: ' + pedido.tema  } */;
    pdfMake.createPdf(ddFolhaParaAprovacao).open();
  }


  private get_ddFolhaParaAprovacao(pedido) {
    return {
      content: [
        {
          columns: [ this.get_ddHeader(pedido) ]

        }
      ]
    };

  }

  private get_ddHeader(pedido) {

        const  header =  [{
          text: 'Cliente: ' + pedido.nomeCliente,
          style: '',
          width: '*'
        },
        {
          text: 'Tema: ' + pedido.tema,
          style: 'bold',
          width: '*'
        }
        ];

        return header;
  }


}



