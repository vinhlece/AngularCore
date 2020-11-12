import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatInputModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {EMPTY, of} from 'rxjs';
import {SignupComponent} from './signup.component';

export default sandboxOf(SignupComponent, {
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
  .add('display user name field, password field and SignUp button', {
    template: `<app-signup [errorMessage$]="errorMessageObservable">`,
    context: {
      errorMessageObservable: EMPTY
    }
  })
  .add('display user name already exists error', {
    template: `<app-signup [errorMessage$]="errorMessageObservable">`,
    context: {
      errorMessageObservable: of('User name already exists.')
    }
  });
