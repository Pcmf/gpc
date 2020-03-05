import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cores',
  templateUrl: './cores.component.html',
  styleUrls: ['./cores.component.scss']
})
export class CoresComponent implements OnInit {
  cores: any = [];
  displayedColumns = ['id', 'nome', 'ref'];

  constructor(private dataService: DataService, private dialog: MatDialog) {
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.dataService.getData('cores').subscribe(
      resp => this.cores = resp
    );
  }

 /**
  * Dialog
  *  ln
  */
  openDialog(ln): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(EditCorDialog, {
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
  selector: 'edit-cor-dialog',
  templateUrl: 'edit-cor-dialog.html',
  styleUrls: ['edit-cor-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditCorDialog {
  constructor(
    public dialogRef: MatDialogRef<EditCorDialog>,
    @Inject(MAT_DIALOG_DATA) public cor,
    private dataService: DataService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveCor(form) {
    if (form.id) {
      // Atualizar
      this.dataService.editData('cores/' + form.id, form ).subscribe(
        resp => {
          this.dialogRef.close(form);
        }
      );
    } else {
      this.dataService.saveData('cores', form ).subscribe(
        resp => {
          this.dialogRef.close(form);
        }
      );
    }
  }

}
