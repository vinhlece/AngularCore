import {CommonModule} from '@angular/common';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ColorPickerModule} from 'ngx-color-picker';
import {EditUserFormComponent} from './edit-user-form.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('EditUserFormComponent', () => {
  let component: EditUserFormComponent;
  let fixture: ComponentFixture<EditUserFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditUserFormComponent
      ],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatDividerModule,
        ColorPickerModule,
        FlexLayoutModule,
        MatCheckboxModule,
        FormsModule
      ],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA]

    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditUserFormComponent);
    component = fixture.componentInstance;
    component.roles = [
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

    component.user = {
      id: 'user id',
      displayName: 'displayName',
      password: 'password'
    };
    fixture.detectChanges();
  }));

  describe('#validation', () => {
    it('Enable save button when selected some roles', () => {
      component.form.controls['roles'].setValue([true, false, false]);
      component.form.controls['roles'].markAsTouched();
      fixture.detectChanges();

      expect(component.form.valid).toEqual(true);
    });
  });

  describe('#onSubmit, #onCancel', () => {
    it('call save event with valid roles settings', () => {
      const spyHandleSave = spyOn(component.save, 'emit');

      component.form.controls['roles'].setValue([true, false, false]);
      component.form.controls['userId'].setValue('user id');
      component.form.controls['displayName'].setValue('displayName');

      fixture.detectChanges();
      fixture.debugElement.query(By.css('.save-btn')).nativeElement.click();
      const user = {
        id: 'user id',
        displayName: 'displayName',
        password: 'password',
        roles: ['id1']
      };
      expect(component.form.valid).toEqual(true);
      expect(spyHandleSave).toHaveBeenCalledWith(user);
    });

    it('call cancel event when click cancel button', () => {
      const spyHandleCancel = spyOn(component, 'handleCancel');
      fixture.debugElement.query(By.css('.cancel-btn')).nativeElement.click();
      expect(spyHandleCancel).toHaveBeenCalled();
    });
  });
});
