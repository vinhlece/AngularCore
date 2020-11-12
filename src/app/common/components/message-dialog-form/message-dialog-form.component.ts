import {Component, Inject, Input, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog-form',
  templateUrl: './message-dialog-form.component.html',
  styleUrls: ['./message-dialog-form.component.scss']
})
export class MessageDialogFormComponent implements OnInit {
  formTitle: string = 'Message';
  inputData: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: string) {
    this.inputData = data;
  }

  ngOnInit() {
  }
}
