import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {NewDialogComponent} from './new-dialog.component';


@Component({
  template: `
    <app-data-dialog [formTitle]="title"
                     [formTitleType]="titleType"
                     [inputData]="inputData"
                     (saveHandler)="onSave($event)"
    ></app-data-dialog>
  `
})
export class NewDialogWithDataComponent extends NewDialogComponent {
  title: string;
  titleType: string;
  inputData: any;

  constructor(dialogRef: MatDialogRef<NewDialogWithDataComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    super(dialogRef);
    this.title = data.title;
    this.titleType = data.titleType;
    this.inputData = data.inputData;
  }

  onSave(event) {
    super.onSave(event);
  }
}
