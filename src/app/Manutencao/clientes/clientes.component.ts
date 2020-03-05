import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from './../../Services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  clientes: any = [];
  displayedColumns = ['nome', 'contacto', 'responsavel', 'email', 'codigo']

  constructor(private dataService: DataService, private dialog: MatDialog) {
    this.getData();
   }

  getData() {
    this.dataService.getData('clientes').subscribe(
      resp => this.clientes = resp
    );
  }

  ngOnInit() {
  }

/**
 * Dialog
 */
openDialog(ln): void {
  // tslint:disable-next-line: no-use-before-declare
  const dialogRef = this.dialog.open(EditClienteDialog, {
    width: '90%',
    data: ln
  });

  dialogRef.afterClosed().subscribe(result => {
    this.getData();
  });
}

}


/**
 * EDIT CLIENTE DIALOG
 */

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-cliente-dialog',
  templateUrl: 'edit-cliente-dialog.html',
  styleUrls: ['edit-cliente-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditClienteDialog {
  constructor(
    public dialogRef: MatDialogRef<EditClienteDialog>,
    @Inject(MAT_DIALOG_DATA) public cliente,
    private dataService: DataService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  receiveImage(event) {
    this.cliente.imagem = event;
  }

  saveCliente(form) {
    form.imagem = this.cliente.imagem;
    if (this.cliente.id) {
      // Atualizar
      this.dataService.editData('clientes/' + this.cliente.id, form ).subscribe(
        resp => {
          this.dialogRef.close(form);
        }
      );
    } else {
      this.dataService.saveData('clientes', form ).subscribe(
        resp => {
          this.dialogRef.close(form);
        }
      );
    }
  }

}
