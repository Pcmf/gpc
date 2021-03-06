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
  private modelos: any = [];
  private pedido: any = [];
  private escalas: any = [];


  constructor(private data: DataService) {
    this.data.getData('empresa').subscribe(
      resp => this.empresa = resp
    );
    this.data.getData('escalas').subscribe(
      res => this.escalas = res
    );

  }


  folhaParaAprovacao(pedido) {
    this.pedido = pedido;
    this.data.getData('clientes/' + this.pedido.clienteId).subscribe(
      respc => {
        this.cliente = respc;
        this.data.getData('modelos/allimgs/' + pedido.id).subscribe(
          respm => {
            this.modelos = respm;
            const ddFolhaParaAprovacao = this.create_folhaParaAprovacao();
            pdfMake.createPdf(ddFolhaParaAprovacao).open();
            const pdfDocGenerator = pdfMake.createPdf(ddFolhaParaAprovacao);
          //  pdfDocGenerator.getBase64((data) => console.log(data));
          }
        );
      }
    );
  }

  folhasParaProducaoModelo(modelo){
    this.data.getData('pedido/' + modelo.pedido).subscribe(
      resp => {
        this.pedido = resp;
        this.data.getData('clientes/' + this.pedido.clienteId).subscribe(
              respc => {
                this.cliente = respc;
                this.data.getData('modelo/allimgs/' + modelo.id).subscribe(
                  respm => {
                    this.modelos = respm;
                    const ddFolhaBordados = this.create_folhaBordados();
                    pdfMake.createPdf(ddFolhaBordados).open();
                  //  const pdfDocGenerator = pdfMake.createPdf(ddFolhaBordados);
                  //  pdfDocGenerator.getBase64((data) => console.log(data));
                    const ddFolhaCorte = this.create_folhaCorte();
                    pdfMake.createPdf(ddFolhaCorte).open();
                //   const pdfDocGeneratorCorte = pdfMake.createPdf(ddFolhaCorte);
                    const ddFolhaConfecao = this.create_folhaConfecao();
                    pdfMake.createPdf(ddFolhaConfecao).open();
                  }
                );
              }
            );
      }
    );
  }



  // Produção por pedido - Bordados, Corte, Confeção 
  folhasParaProducao(pedido) {
    this.pedido = pedido;
    this.data.getData('clientes/' + this.pedido.clienteId).subscribe(
      respc => {
        this.cliente = respc;
        this.data.getData('modelos/allimgs/' + pedido.id).subscribe(
          respm => {
            this.modelos = respm;
            const ddFolhaBordados = this.create_folhaBordados();
            pdfMake.createPdf(ddFolhaBordados).open();
          //  const pdfDocGenerator = pdfMake.createPdf(ddFolhaBordados);
          //  pdfDocGenerator.getBase64((data) => console.log(data));
            const ddFolhaCorte = this.create_folhaCorte();
            pdfMake.createPdf(ddFolhaCorte).open();
         //   const pdfDocGeneratorCorte = pdfMake.createPdf(ddFolhaCorte);
            const ddFolhaConfecao = this.create_folhaConfecao();
            pdfMake.createPdf(ddFolhaConfecao).open();
          }
        );
      }
    );
  }

  private create_folhaParaAprovacao() {

    // Create document template
    const doc = this.getDocTemplate();

    // Para cada modelo do pedido vai adicionando o conteudo ao doc.content com push
    this.modelos.map(modelo => {
      doc.content.push(this.get_ddHeader());
      doc.content.push(this.getLine());
      doc.content.push(this.getIdentificacaoModeloLine(modelo.modelo));
      doc.content.push(this.getMainImageAndObsBox(modelo.modelo));
      doc.content.push(this.getTabelaQtyTamanhos());
      doc.content.push(this.getPageBreak());
      doc.content.push(this.getImagensModelo(modelo.imgs));
      // Page break para novo modelo
      doc.content.push(this.getPageBreak());
    });

    return doc;
  }
  /**
   * Folha Bordados
   */
  private create_folhaBordados() {
    const doc = this.getDocTemplate();

    this.modelos.map(el => {
          const escala = this.escalas[el.modelo.escala - 1].tamanhos.split(',');
          doc.content.push(this.get_ddHeader());
          doc.content.push(this.getTitulo('Folha Bordados'));
          doc.content.push(this.getLine());
          doc.content.push(this.getIdentificacaoModeloLine(el.modelo));
          doc.content.push(this.getModeloMainImage(el.modelo, 100));
          doc.content.push(this.getTabelaTamanhos(el.dpc, escala));
          doc.content.push(this.getObsBox(el.modelo));
          doc.content.push(this.getTabelaProducao());
          doc.content.push(this.getNotasBox());
          // Se tiver imagens extra
          if (el.imgs.length > 0) {
            doc.content.push(this.getPageBreak());
            doc.content.push(this.getImagensModelo(el.imgs));
          }
          // Page break para novo modelo
          doc.content.push(this.getPageBreak());
        }
      );
    return doc;
  }

  /**
   * Folha de Corte
   */
  private create_folhaCorte() {
    const doc = this.getDocTemplate();
    this.modelos.map(el => {
      const escala = this.escalas[el.modelo.escala - 1].tamanhos.split(',');
      doc.content.push(this.get_ddHeader());
      doc.content.push(this.getTitulo('Folha de Corte'));
      doc.content.push(this.getLine());
      doc.content.push(this.getIdentificacaoModeloLine(el.modelo));
      doc.content.push(this.getModeloMainImage(el.modelo, 100));
      doc.content.push(this.getTabelaTamanhos(el.dpc, escala));

      doc.content.push(this.getTabelaMaterial(el.dpc, escala));

      doc.content.push(this.getObsBox(el.modelo));
                // Se tiver imagens extra
      if (el.imgs.length > 0) {
                  doc.content.push(this.getPageBreak());
                  doc.content.push(this.getImagensModelo(el.imgs));
                }
      doc.content.push(this.getPageBreak());
    });
    return doc;
  }
  /**
   * Folha de Confeção
   */
  private create_folhaConfecao() {
    const doc = this.getDocTemplate();
    this.modelos.map(el => {
      const escala = this.escalas[el.modelo.escala - 1].tamanhos.split(',');
      doc.content.push(this.get_ddHeader());
      doc.content.push(this.getTitulo('Folha de Confeção'));
      doc.content.push(this.getLine());
      doc.content.push(this.getIdentificacaoModeloLine(el.modelo));
      doc.content.push(this.getModeloMainImage(el.modelo, 100));
      doc.content.push(this.getTabelaTamanhos(el.dpc, escala));

      doc.content.push(this.getTabelaRegistro(el.dpc, escala));

      doc.content.push(this.getObsBox(el.modelo));
                // Se tiver imagens extra
      if (el.imgs.length > 0) {
                  doc.content.push(this.getPageBreak());
                  doc.content.push(this.getImagensModelo(el.imgs));
                }
      doc.content.push(this.getPageBreak());
    });
    return doc;
  }

  private getDocTemplate(){
    return {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [30, 30, 30, 30],
      content: []
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

  private getTitulo(titulo) {
    return  {
      text: titulo,
      fontSize: 14,
      alignment: 'center',
      margin: 5
    };
  }

  private getLine() {
    return {
      canvas: [
        {
          type: 'line',
          x1: 5, y1: 10,
          x2: 515, y2: 10,
          lineWidth: 1
        }
      ]
    };
  }

  private getIdentificacaoModeloLine(modelo) {
    return {
      columns: [
        [this.getIdentificacaoModelo(modelo)],
        [this.getModeloDescricao(modelo)]
      ]
    };
  }

  private getIdentificacaoModelo(modelo) {
    return [
      {
        text: 'Modelo: ' + modelo.nome,
        fontSize: 9,
        margin: [0, 5]
      },
      {
        text: 'Ref Cliente: ' + modelo.refcliente,
        fontSize: 9
      },
      {
        text: 'Ref Interna: ' + modelo.refinterna,
        fontSize: 9
      },
      {
        text: 'Preço: ' + modelo.preco + '€',
        fontSize: 9
      },
      {
        text: modelo.data,
        fontSize: 9
      }
    ];
  }

  private getMainImageAndObsBox(modelo) {
    return {
      columns: [
        [this.getModeloMainImage(modelo, 200)],
        [
          {
            text: 'Observações:',
            alignment: 'left'
          },
          [this.getRectangulo()]
        ]
      ]
    };
  }

  private getModeloDescricao(modelo) {
    return {
      text: 'Descricao: ' + modelo.descricao,
      fontSize: 8,
      margin: [0, 5]
    };
  }

  private getModeloMainImage(modelo, w) {
    if (modelo.foto) {
      return {
        margin: 10,
        image: modelo.foto,
        width: w,
        alignment: 'center'
      };
    }
    return null;
  }

  private getRectangulo() {
    return {
      margin: 6,
      canvas:
        [{
          type: 'rect',
          x: 0, y: 0,
          w: 200,
          h: 250,
          lineWidth: 2,
          lineColor: '#9e9e9e',
        }
        ]
    };
  }

  private getTabelaQtyTamanhos() {
    return {
      margin: [0, 20],
      table: {
        widths: [100, 100, '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
        body: [
          [{ text: ' ** ', colSpan: 2, alignment: 'center' },
          {},
          { text: 'Tamanhos', colSpan: 10, alignment: 'center' }],
          [
            { text: 'Cores', alignment: 'center' },
            { text: 'Elementos', alignment: 'center' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ],
          [
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' },
            { text: ' ' }
          ]
        ]
      }
    };
  }

  private getImagensModelo(imgs) {
    if (imgs.length == 1) {
      return {
        image: imgs[0].foto,
        width: 400,
        alignment: 'center'
      };
    } else if (imgs.length == 2) {
      return [
        {
          image: imgs[0].foto,
          fit: [400, 350],
          alignment: 'center'
        },
        {
          image: imgs[1].foto,
          fit: [400, 350],
          alignment: 'center'
        }
      ];
    } else if (imgs.length == 3) {
      return [
        {
          image: imgs[0].foto,
          fit: [400, 350],
          alignment: 'center'
        }, {
          columns: [
            {
              image: imgs[1].foto,
              fit: [250, 350],
              width: '*'
            },
            {
              image: imgs[2].foto,
              fit: [250, 350],
              width: '*'
            }
          ]
        }
      ];
    } else if (imgs.length == 4) {
      return [{
        columns: [
          {
            image: imgs[0].foto,
            fit: [250, 350],
            width: '*'
          },
          {
            image: imgs[1].foto,
            fit: [250, 350],
            width: '*'
          }]
        }, { text: '..'},
        {
        columns: [
          {
            image: imgs[2].foto,
            fit: [250, 350],
            width: '*'
          },
          {
            image: imgs[3].foto,
            fit: [250, 350],
            width: '*'
          }
        ]
      }
      ];
    }
  }

  private getTabelaTamanhos(dpc, escala) {
    return {
      margin: [0, 20],
      fontSize: 8,
      table: {
        widths: [50, 50, 50, 50, 50, ...this.getEscalaColumnsWidths(escala)],
        body: [
          [{ text: 'Cor 1', alignment: 'center' },
          { text: 'Cor 2', alignment: 'center' },
          { text: 'Elem 1', alignment: 'center' },
          { text: 'Elem 2', alignment: 'center' },
          { text: 'Elem 3', alignment: 'center' }, ...this.getEscalaColumnsNames(escala)],
           ...this.getDadosDetalhe(dpc, escala)
        ]
      }
    };

  }

  private getDadosDetalhe(dpc, escala){
    const array = [];
    dpc.map((ln) => {
      const array1 = [];
      array1.push({text: ln.ncor1}, {text: ln.ncor2}, [{text: ln.nelem1}, {text: ln.nelem1cor}], {text: ln.nelem2}, {text: ln.nelem3});
      escala.forEach(sz => {
        if (ln.qtys[sz]){
          array1.push({text: ln.qtys[sz]});
        } else {
          array1.push({text: 0});
        }
      });
      array.push(array1);
    });
    return array;
  }

  private getObsBox(modelo) {
    return {
        table: {
        widths: ['*'],
        heights: [ 70],
        body: [
          [{text: 'Obs: ' + modelo.obsinternas}]
        ]
      }
    };
  }

  private getTabelaProducao() {
    return {
        margin: [0, 10],
        table: {
        widths: ['*', '*', '*', '*', '*'],
        // heights: [ 30],
        body: [
          ['Inicio Produção', 'Fim Produção', 'Peças/Hora', 'Preço Bordado', 'Total'],
          [' ', ' ', ' ', ' ', ' ']
        ]
      }
    };
  }

  private getTabelaMaterial(dpc, escala) {
    return {
        margin: [0, 10],
        fontSize: 8,
        table: {
        widths: ['*', '*', '*', '*', '*', '*', '*'],
        // heights: [ 30],
        body: [
          ['Cor 1', 'Cor 2', 'Kilos', 'Tipo Malha', 'Fornecedor', 'Qtd Gasta', 'Peso p/Cor'],
          ...this.getCorMaterial(dpc)
        ]
      }
    };
  }

  private getCorMaterial(dcp) {
    const array = [];
    dcp.map((ln) => {
      array.push([{text: ln.ncor1}, {text: ln.ncor2}, {text: ' ', fontSize: 12}, {text: ''} , {text: ''} , {text: ''} , {text: ''}] );
    });
    return array;
  }

  private getTabelaRegistro(dpc, escala) {
    return {
        margin: [0, 10],
        fontSize: 8,
        table: {
        widths: ['*', '*', '*', '*', '*', '*', '*'],
        // heights: [ 30],
        body: [
          ['Entrada Linha', 'Data Saida', 'Produção Média', 'Qtd Pedido', 'Custo Feitio', 'Total', ''],
          [{text: ' ', fontSize: 18 }, '   ', '   ', '   ', '   ', '  ', '  ']
        ]
      }
    };
  }

  private getNotasBox() {
    return {
        margin: [0, 10],
        table: {
        widths: ['*'],
        heights: [ 70],
        body: [
          [{text: 'Notas: '}]
        ]
      }
    };
  }

  private getEscalaColumnsWidths(escala) {
    const array = [];
    escala.forEach(element => {
      array.push('*');
    });
    return array;
  }

  private getEscalaColumnsNames(escala) {
    const cn = [];
    escala.forEach(elem => {
      cn.push({text: elem, alignment: 'center'});
    });
    return cn;
  }

  private getMyLogo() {
    if (this.empresa.logotipo) {
      return {
        image: this.empresa.logotipo,
        width: 75,
        alignment: 'left'
      };
    }
    return null;
  }

  private getClienteLogo() {
    if (this.cliente.imagem) {
      return {
        image: this.cliente.imagem,
        width: 75,
        alignment: 'right'
      };
    }
    return null;
  }

  private getPageBreak() {
    return {
      text: ' ',
      pageBreak: 'before'
    };
  }


}



