import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {NewDialogComponent} from './new-dialog.component';

@Component({
  template: `
    <app-simple-name-form [formTitle]="title"
                          [inputData]="inputData"
                          (saveHandler)="onSave($event)"
                          (cancelHandler)="onCancel($event)"></app-simple-name-form>
  `
})
export class NewDialogWithTitleComponent extends NewDialogComponent {
  title: string;
  inputData: any;

  constructor(dialogRef: MatDialogRef<NewDialogWithTitleComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
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
