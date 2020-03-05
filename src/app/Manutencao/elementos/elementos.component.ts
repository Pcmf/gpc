import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-elementos',
  templateUrl: './elementos.component.html',
  styleUrls: ['./elementos.component.scss']
})
export class ElementosComponent implements OnInit {
  elementos: any = [];
  displayedColumns = ['id', 'nome', 'descricao'];

  constructor(private dataService: DataService, private dialog: MatDialog) {
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.dataService.getData('elementos').subscribe(
      resp => this.elementos = resp
    );
  }

 /**
  * Dialog
  *  ln
  */
  openDialog(ln): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(EditElementoDialog, {
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
  selector: 'edit-elemento-dialog',
  templateUrl: 'edit-elemento-dialog.html',
  styleUrls: ['edit-elemento-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditElementoDialog {
  constructor(
    public dialogRef: MatDialogRef<EditElementoDialog>,
    @Inject(MAT_DIALOG_DATA) public elemento,
    private dataService: DataService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveElemento(form) {
    if (form.id) {
      // Atualizar
      this.dataService.editData('elementos/' + form.id, form ).subscribe(
        resp => {
          this.dialogRef.close(form);
        }
      );
    } else {
      this.dataService.saveData('elementos', form ).subscribe(
        resp => {
          this.dialogRef.close(form);
        }
      );
    }
  }

}
