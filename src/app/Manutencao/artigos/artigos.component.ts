import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-artigos',
  templateUrl: './artigos.component.html',
  styleUrls: ['./artigos.component.scss']
})
export class ArtigosComponent implements OnInit {
  artigos: any = [];
  displayedColumns = ['id', 'nome', 'descricao'];

  constructor(private dataService: DataService, private dialog: MatDialog) {
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.dataService.getData('artigos').subscribe(
      resp => this.artigos = resp
    );
  }

 /**
  * Dialog
  *  ln
  */
  openDialog(ln): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(EditArtigoDialog, {
      width: '50%',
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
  selector: 'edit-artigo-dialog',
  templateUrl: 'edit-artigo-dialog.html',
  styleUrls: ['edit-artigo-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditArtigoDialog {
  constructor(
    public dialogRef: MatDialogRef<EditArtigoDialog>,
    @Inject(MAT_DIALOG_DATA) public artigo,
    private dataService: DataService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

/*   receiveImage(event) {
    this.cliente.imagem = event;
  } */

  saveArtigo(form) {
    console.table(form);
    if (form.id) {
      // Atualizar
      this.dataService.editData('artigos/' + form.id, form ).subscribe(
        resp => {
          this.dialogRef.close(form);
        }
      );
    } else {
      this.dataService.saveData('artigos', form ).subscribe(
        resp => {
          this.dialogRef.close(form);
        }
      );
    }
  }

}
