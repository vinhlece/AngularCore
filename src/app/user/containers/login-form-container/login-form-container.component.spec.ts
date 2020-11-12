import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {ActionMeta} from '../../../common/actions';
import {Login} from '../../actions/user.actions';
import {LoginFormComponent} from '../../components/login-form/login-form.component';
import {Credentials} from '../../models/user';
import {LoginFormContainerComponent} from './login-form-container.component';

describe('LoginFormContainerComponent', () => {
  let component: LoginFormContainerComponent;
  let fixture: ComponentFixture<LoginFormContainerComponent>;
  let storeSpy;

  beforeEach(async(() => {
    storeSpy = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    storeSpy.pipe.and.returnValue(of('error'));

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule
      ],
      declarations: [LoginFormContainerComponent, LoginFormComponent],
      providers: [
        FormBuilder,
        {
          provide: Store, useValue: storeSpy
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoginFormContainerComponent);
    component = fixture.componentInstance;
    describe('constructor', () => {
      it('call store.pipe to call select with getLoginErrorMessage selector', () => {
        expect(storeSpy.pipe).toHaveBeenCalled();
      });
    });

    describe('#configure presentational component', () => {
      let uiComponent: LoginFormComponent;

      beforeEach(() => {
        uiComponent = fixture.debugElement.query(By.directive(LoginFormComponent)).componentInstance;
      });

      it('Input parameters are setup correctly', () => {
        expect(uiComponent.errorMessage$).toBe(component.errorMessage$);
      });

      it('Output events are setup correctly', () => {
        const spy = spyOn(component, 'handleLogin');
        uiComponent.login.emit({});
        expect(spy).toHaveBeenCalledWith({});
      });
    });

    describe('#handleLogin', () => {
      it('should dispatch login action with navigation meta = true', () => {
        const meta: ActionMeta = {doNavigation: true};
        const credentials: Credentials = {userName: 'username', password: 'password'};
        component.handleLogin(credentials);
        expect(storeSpy.dispatch).toHaveBeenCalledWith(new Login(credentials, meta));
      });
    });
    fixture.detectChanges();
  }));

});
