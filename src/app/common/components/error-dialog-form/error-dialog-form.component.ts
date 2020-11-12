import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog-form',
  templateUrl: './error-dialog-form.component.html',
  styleUrls: ['./error-dialog-form.component.scss']
})
export class ErrorDialogFormComponent implements OnInit {
  public errorMsg: string;
  constructor(@Inject(MAT_DIALOG_DATA) data: string) {
    this.errorMsg = data;
  }

  ngOnInit() {
  }

}
