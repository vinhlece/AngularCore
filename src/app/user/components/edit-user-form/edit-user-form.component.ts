import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors,
  Validators
} from '@angular/forms';
import {Observable} from 'rxjs';
import {ColorPalette} from '../../../common/models/index';
import {Role, User} from '../../models/user';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-edit-user-form',
  templateUrl: './edit-user-form.component.html',
  styleUrls: ['./edit-user-form.component.scss']
})
export class EditUserFormComponent implements OnInit, OnChanges {
  private _fb: FormBuilder;
  form: FormGroup;

  @Input() user: User;
  @Input() roles: Role[];
  @Input() rolesByUser: string[];
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  static requiredSelected(control: AbstractControl): ValidationErrors | null {
    return control.value.find((selected: boolean) => selected)
      ? null
      : {requiredSelected: true};
  }

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      roles: this.createControl(),
      userId:  [{
        value: null,
        disabled: true
      }],
      displayName: [{
        value: null,
        disabled: true
      }]
    });
  }

  ngOnChanges() {
    if (this.form) {
      this.form.setControl('roles', this.createControl());
    }
  }

  private _propagateChange = (_: any) => {
    // no op
  }

  onSubmit() {
    if (this.form.valid) {
      const value = this.getControl('roles').value;
      const selectedRoles = this.roles.filter((role: Role, idx: number) => value[idx])
        .map(role => role.id);
      const newUser = {...this.user, roles: selectedRoles};
      this.save.emit(newUser);
    }
  }

  handleCancel() {
    this.cancel.emit();
  }

  private getControl(controlName: string): AbstractControl {
    return this.form.get(controlName);
  }

  private createControl(): AbstractControl {
    const values = this.roles.map((role: Role) => {
      return this.rolesByUser && !isNullOrUndefined(this.rolesByUser.find(roleId => roleId === role.id));
    });
    return this._fb.array(values, EditUserFormComponent.requiredSelected);
  }
}
