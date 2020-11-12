import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  private _dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  data: any;

  constructor(dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this._dialogRef = dialogRef;
    this.data = data;
  }

  handleClick(choice: string) {
    this._dialogRef.close(choice);
  }
}
