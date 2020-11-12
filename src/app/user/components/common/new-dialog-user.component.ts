import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {NewDialogComponent} from '../../../user/components/common/new-dialog.component';

@Component({
  template: `
    <app-new-user-form  [formTitle]="title"
                        [inputData]="inputData"
                        (saveHandler)="onSave($event)"
                        (cancelHandler)="onCancel($event)"></app-new-user-form>
  `
})
export class NewDialogUserComponent extends NewDialogComponent {
  title: string;
  inputData: any;

  constructor(dialogRef: MatDialogRef<NewDialogUserComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    super(dialogRef);
    this.title = data.title;
    this.inputData = data.inputData;
  }

  onSave(event) {
    super.onSave(event);
  }

  onCancel(event) {
    super.onCancel(event);
  }
}
