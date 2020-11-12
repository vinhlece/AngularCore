import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {SignUp} from '../../actions/user.actions';
import {SignupComponent} from '../../components/signup/signup.component';
import {Credentials} from '../../models/user';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {SignupContainerComponent} from './signup-container.component';

describe('SignupContainerComponent', () => {
  let component: SignupContainerComponent;
  let fixture: ComponentFixture<SignupContainerComponent>;
  let mockStore;

  beforeEach(async(() => {
    mockStore = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    mockStore.pipe.and.returnValue(of('error'));
    TestBed.configureTestingModule({
      declarations: [
        SignupContainerComponent,
        SignupComponent
      ],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        HttpClientModule
      ],
      providers: [
        AuthenticationService,
        {
          provide: Store, useValue: mockStore
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('call store.pipe to select with getSignupErrorMessage selector', () => {
      expect(mockStore.pipe).toHaveBeenCalled();
    });
  });

  describe('#configure presentational component', () => {
    let uiComponent: SignupComponent;

    beforeEach(() => {
      uiComponent = fixture.debugElement.query(By.directive(SignupComponent)).componentInstance;
    });

    it('Input parameters are setup correctly', () => {
      expect(uiComponent.errorMessage$).toBe(component.errorMessage$);
    });

    it('Output events are setup correctly', () => {
      const spy = spyOn(component, 'signUp');
      uiComponent.signup.emit({});
      expect(spy).toHaveBeenCalledWith({});
    });
  });

  describe('#signupUser', () => {
    it('should dispatch Signup action with signup information', () => {
      const credentials: Credentials = {userName: 'username', password: 'password'};
      component.signUp(credentials);
      expect(mockStore.dispatch).toHaveBeenCalledWith(new SignUp(credentials));
    });
  });
});
