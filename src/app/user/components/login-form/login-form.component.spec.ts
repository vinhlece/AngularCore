import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EMPTY, of} from 'rxjs';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {LoginFormComponent} from './login-form.component';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../theme/theme.module';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        ThemeModule,
        MatBottomSheetModule
      ],
      providers: [
        AuthenticationService
      ]

    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
  }));

  describe('#validation', () => {
    it('shows error when username is empty', () => {
      fixture.detectChanges();
      component.loginForm.controls['userName'].setValue('');
      component.loginForm.controls['userName'].markAsTouched();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('#userNameRequiredError'))).not.toBeNull();
    });

    it('shows error when password is empty', () => {
      fixture.detectChanges();
      component.loginForm.controls['password'].setValue('');
      component.loginForm.controls['password'].markAsTouched();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('#passwordRequiredError'))).not.toBeNull();
    });

    it('do not show errorMessage when username and password are not empty', () => {
      fixture.detectChanges();
      component.loginForm.controls['userName'].setValue('username');
      component.loginForm.controls['password'].setValue('password');
      component.loginForm.controls['userName'].markAsTouched();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('#userNameRequiredError'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#passwordRequiredError'))).toBeNull();
    });
  });

  describe('#errorMessage$', () => {
    it('do not show error message when it is empty', fakeAsync(() => {
      component.errorMessage$ = EMPTY;
      tick();
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('#error'));
      expect(errorElement).toBeNull();
    }));

    it('show error message when it is not empty', fakeAsync(() => {
      component.errorMessage$ = of({errorMessage: 'Error message'});
      tick();
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('#error'));
      expect(errorElement).not.toBeNull();
      expect(errorElement.nativeElement.textContent).toBe('Error message');
    }));
  });

  describe('#onSubmit', () => {
    it('emit event with username and password', () => {
      fixture.detectChanges();
      const spyHandleLogin = jasmine.createSpy('handleLogin');
      component.login.subscribe(spyHandleLogin);

      const userName = 'username';
      component.loginForm.controls['userName'].setValue(userName);
      const password = 'password';
      component.loginForm.controls['password'].setValue(password);
      fixture.detectChanges();
      fixture.debugElement.query(By.css('button')).nativeElement.click();

      expect(spyHandleLogin).toHaveBeenCalledWith({userName: userName, password: password});
    });

    it('not emit event if form is invalid', () => {
      fixture.detectChanges();
      const spyHandleLogin = jasmine.createSpy('handleLogin');
      component.login.subscribe(spyHandleLogin);

      component.loginForm.controls['userName'].setValue('');
      component.loginForm.controls['password'].setValue('');
      fixture.detectChanges();
      fixture.debugElement.query(By.css('button')).nativeElement.click();

      expect(spyHandleLogin).not.toHaveBeenCalled();
    });
  });
});
