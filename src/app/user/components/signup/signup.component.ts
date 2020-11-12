import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {isNullOrUndefined} from 'util';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  @Input() errorMessage$: Observable<string>;
  @Output() signup = new EventEmitter();

  ngOnInit() {
    this.signupForm = new FormGroup({
      'userName': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
    if (isNullOrUndefined(this.errorMessage$)) {
      this.errorMessage$ = null;
    }
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.signup.emit(this.signupForm.value);
    }
  }
}
