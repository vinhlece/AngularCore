import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatCheckboxModule, MatDividerModule, MatIconModule, MatInputModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {ColorPickerModule} from 'ngx-color-picker';
import {Component, OnInit} from '@angular/core';
import {EditUserFormComponent} from './edit-user-form.component';
import {Role, User} from '../../models/user';

@Component({
  selector: 'app-edit-user-form-sandbox',
  template: `
    <div>
      <app-edit-user-form [formGroup]="form"></app-edit-user-form>
    </div>
  `
})
class EditUserFormComponentSandbox implements OnInit {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      roles: this._fb.array([false, false, false]),
      userId: this._fb.control('userId'),
      displayName: this._fb.control('displayName')
    });
  }
}

const roles: Role[] = [
  {
    id: 'id1',
    name: 'name 1'
  },
  {
    id: 'id2',
    name: 'name 2'
  },
  {
    id: 'id3',
    name: 'name 3'
  }
];

const user: User = {
  id: 'user id',
  displayName: 'displayName',
  password: 'password'
};

export default sandboxOf(EditUserFormComponent, {
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ColorPickerModule,
    FlexLayoutModule,
    MatCheckboxModule
  ],
  declarations: [EditUserFormComponent],
  providers: [
  ]
})
  .add('display all roles configuration for new users', {
    template: `<app-edit-user-form [roles]="roles$"
    [rolesForUser]="rolesForUser$"
    [user]="user$">`,
    context: {
      roles$: roles,
      rolesForUser$: [],
      user$: user
    }
  })
  .add('display selected roles configuration for existing users', {
    template: `<app-edit-user-form [roles]="roles$"
    [rolesForUser]="rolesForUser$"
    [user]="user$">`,
    context: {
      roles$: roles,
      rolesForUser$: [roles[0]],
      user$: user
    }
  });

