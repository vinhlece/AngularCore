import {Component, Inject} from '@angular/core';
import {NewDialogComponent} from './new-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  template: `
    <app-change-widget-type-dialog [formTitle]="title"
                     [inputData]="inputData"
                     (saveHandler)="onSave($event)"
    ></app-change-widget-type-dialog>
  `
})
export class ChangeTypeDialogComponent extends NewDialogComponent {
  title: string;
  inputData: any;

  constructor(dialogRef: MatDialogRef<ChangeTypeDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    super(dialogRef);
    this.title = data.title;
    this.inputData = data.inputData;
  }

  onSave(event) {
    super.onSave(event);
  }
}
