import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NewDialogComponent} from './new-dialog.component';
@Component({
  template: `
    <app-legend-configuration [formTitle]="title"
                     [inputData]="inputData"
                     (saveHandler)="onSave($event)"
    ></app-legend-configuration>
  `
})
export class LegendDialogComponent extends NewDialogComponent {
  title: string;
  titleType: string;
  inputData: any;

  constructor(dialogRef: MatDialogRef<LegendDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    super(dialogRef);
    this.title = data.title;
    this.inputData = data.inputData;
  }

  onSave(event) {
    super.onSave(event);
  }
}
