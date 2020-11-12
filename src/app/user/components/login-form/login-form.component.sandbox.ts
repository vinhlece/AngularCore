import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatInputModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {EMPTY, of} from 'rxjs';
import {LoginFormComponent} from './login-form.component';

export default sandboxOf(LoginFormComponent, {
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule
  ]
})
  .add('display user name field, password field and Login button', {
    template: `<app-login-form [errorMessage$]="errorMessageObservable">`,
    context: {
      errorMessageObservable: EMPTY
    }
  })
  .add('display invalid user error', {
    template: `<app-login-form [errorMessage$]="errorMessageObservable">`,
    context: {
      errorMessageObservable: of('User name or Password is invalid.')
    }
  });
