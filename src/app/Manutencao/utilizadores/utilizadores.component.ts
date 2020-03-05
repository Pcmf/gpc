import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-utilizadores',
  templateUrl: './utilizadores.component.html',
  styleUrls: ['./utilizadores.component.scss']
})
export class UtilizadoresComponent implements OnInit {
  utilizadores: any = [];
  displayedColumns = ['id', 'nome', 'username', 'password', 'type'];

  constructor(private dataService: DataService, private dialog: MatDialog) {
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.dataService.getData('utilizadores').subscribe(
      resp => this.utilizadores = resp
    );
  }

 /**
  * Dialog
  *  ln
  */
  openDialog(ln): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(EditUtilizadoresDialog, {
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
  selector: 'edit-utilizadores-dialog',
  templateUrl: 'edit-utilizadores-dialog.html',
  styleUrls: ['edit-utilizadores-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditUtilizadoresDialog {
  constructor(
    public dialogRef: MatDialogRef<EditUtilizadoresDialog>,
    @Inject(MAT_DIALOG_DATA) public utilizador,
    private dataService: DataService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveUtilizador(form) {
    if (form.id) {
      // Atualizar
      this.dataService.editData('utilizadores/' + form.id, form ).subscribe(
        resp => {
          this.dialogRef.close(form);
        }
      );
    } else {
      this.dataService.saveData('utilizadores', form ).subscribe(
        resp => {
          this.dialogRef.close(form);
        }
      );
    }
  }

}
