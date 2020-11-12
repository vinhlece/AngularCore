import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-tab-dialog',
  templateUrl: './delete-tab-dialog.component.html',
  styleUrls: ['./delete-tab-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteTabDialogComponent {
  dialogRef: MatDialogRef<DeleteTabDialogComponent>;
  data: any;

  constructor(dialogRef: MatDialogRef<DeleteTabDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.dialogRef = dialogRef;
    this.data = data;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
