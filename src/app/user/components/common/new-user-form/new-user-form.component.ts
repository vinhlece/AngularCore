import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.scss']
})
export class NewUserFormComponent implements OnInit {
  @Input() formTitle: string;
  @Input() inputData: any;
  @Output() saveHandler: EventEmitter<object>;
  @Output() cancelHandler: EventEmitter<string>;

  newUserForm = this.fb.group({
    id: ['', Validators.required],
    displayName: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {
    this.saveHandler = new EventEmitter();
    this.cancelHandler = new EventEmitter();
  }

  ngOnInit() {
  }

  onSave() {
    this.saveHandler.emit(this.newUserForm.value);
  }

  onCancel() {
    this.cancelHandler.emit('close');
  }
}
