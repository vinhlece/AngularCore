import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-confirmation-title-dialog',
  templateUrl: './confirmation-title-dialog.component.html',
  styleUrls: ['./confirmation-title-dialog.component.scss']
})
export class ConfirmationTitleDialogComponent implements OnInit {
  private _dialogRef: MatDialogRef<ConfirmationTitleDialogComponent>;

  newForm: FormGroup;
  data: any;

  constructor(dialogRef: MatDialogRef<ConfirmationTitleDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this._dialogRef = dialogRef;
    this.data = data;
  }

  ngOnInit() {
    this.newForm = new FormGroup({
        'title': new FormControl(this.data.input, [])
      }
    );
  }

  onSave() {
    this._dialogRef.close(this.newForm.value.title);
  }
}
