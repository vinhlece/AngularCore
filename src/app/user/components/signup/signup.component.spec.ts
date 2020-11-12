import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EMPTY, of} from 'rxjs';
import {SignupComponent} from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        HttpClientModule
      ]
    }).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
  });

  it('should have a signup button', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.querySelector('button').getAttribute('type')).toBe('submit');
  });

  it('should have an error message when username is empty', () => {
    fixture.detectChanges();

    const user = component.signupForm.get('userName');
    user.setValue('');
    user.markAsTouched();

    const password = component.signupForm.get('password');
    password.setValue('12345678');
    password.markAsTouched();

    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.querySelector('mat-error').textContent).toBe('Username is required');

  });

  it('should have two error message when both username and password are empty', () => {
    fixture.detectChanges();

    const user = component.signupForm.get('userName');
    user.setValue('');
    user.markAsTouched();

    const password = component.signupForm.get('password');
    password.setValue('');
    password.markAsTouched();

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const usernameError = fixture.debugElement.query(By.css('.username-error'));
    const passwordError = fixture.debugElement.query(By.css('.password-error'));

    expect(usernameError.nativeElement.textContent).toBe('Username is required');
    expect(usernameError.nativeElement.textContent).toBe('Username is required');

  });

  it('should emit an event with correct parameters when submitting signup form', () => {
    fixture.detectChanges();

    component.signupForm.get('userName').setValue('abc');
    component.signupForm.get('password').setValue('123456');

    spyOn(component.signup, 'emit');

    component.onSignup();

    fixture.detectChanges();

    expect(component.signup.emit).toHaveBeenCalledWith({userName: 'abc', password: '123456'});
  });

  it('should not emit an event when submitting invalid signup form', () => {
    fixture.detectChanges();

    const user = component.signupForm.get('userName');
    user.setValue('');
    user.markAsTouched();

    const password = component.signupForm.get('password');
    password.setValue('');
    password.markAsTouched();

    spyOn(component.signup, 'emit');

    component.onSignup();

    expect(component.signup.emit).not.toHaveBeenCalled();
  });

  describe('#errorMessage$', () => {
    it('do not show error message when it is empty', fakeAsync(() => {
      component.errorMessage$ = EMPTY;
      tick();
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('.signup-error'));
      expect(errorElement).toBeNull();
    }));

    it('show error message when it is not empty', fakeAsync(() => {
      component.errorMessage$ = of('Error message');
      tick();
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('.signup-error'));
      expect(errorElement).not.toBeNull();
      expect(errorElement.nativeElement.textContent).toBe('Error message');
    }));
  });

});
