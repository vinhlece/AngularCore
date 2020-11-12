import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {NewDialogComponent} from '../forms/common/new-dialog.component';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-edit-widget-dialog',
  templateUrl: './edit-widget-dialog.component.html',
  styleUrls: ['./edit-widget-dialog.component.scss']
})
export class EditWidgetDialogComponent extends NewDialogComponent implements OnInit {
  private _fb: FormBuilder;

  data: any;
  formTitle: string;
  newForm: FormGroup;

  constructor(dialogRef: MatDialogRef<EditWidgetDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data: any,
              fb: FormBuilder) {
    super(dialogRef);
    this.data = data;
    this.formTitle = data.title;
    this._fb = fb;
  }

  ngOnInit() {
    this.newForm = this._fb.group({
      editingColumn: this.data.column
    });
  }

  onSave() {
    const saveData = this.newForm.getRawValue();
    super.onSave(saveData);
  }

  onCancel() {
    super.onSave(null);
  }
}
