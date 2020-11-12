import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {Observable} from 'rxjs';
import { SelectThemeBottomSheet } from './select-theme-botton-sheet/select-theme-bottom-sheet';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;

  @Input() errorMessage$: Observable<any>;
  @Output() login = new EventEmitter();

  constructor(private _bottomSheet: MatBottomSheet) {

  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'userName': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });

  }

  currentUser() {
    console.log('currentUser');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.login.emit(this.loginForm.value);
    }
  }

  onClickOpenBottomSheet() {
    this._bottomSheet.open(SelectThemeBottomSheet);
  }
}


