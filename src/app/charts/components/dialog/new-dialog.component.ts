import {MatDialogRef} from '@angular/material/dialog';
export abstract class NewDialogComponent {
  private dialogRef: MatDialogRef<NewDialogComponent>;

  constructor(dialogRef: MatDialogRef<NewDialogComponent>) {
    this.dialogRef = dialogRef;
  }

  onSave(event) {
    this.dialogRef.close(event);
  }

  onCancel(event) {
    this.dialogRef.close();
  }
}
