import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {EditUserContainerComponent} from './edit-user-container.component';
import {Store} from '@ngrx/store';
import {UserNavigator} from '../../../layout/navigator/user.navigator';
import {EditUserFormComponent} from '../../components/edit-user-form/edit-user-form.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '../../../common/common.module';
import {of} from 'rxjs/index';
import {ActivatedRoute} from '@angular/router';

describe('EditUserContainerComponent', () => {
  let component: EditUserContainerComponent;
  let fixture: ComponentFixture<EditUserContainerComponent>;
  let mockStore;
  let mockNavigation;

  beforeEach(async(() => {
    mockStore = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    mockNavigation = jasmine.createSpyObj('userNavigator', ['navigateToUser']);
    TestBed.configureTestingModule({
      declarations: [ EditUserContainerComponent, EditUserFormComponent ],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatCheckboxModule
      ],
      providers: [
        {
          provide: Store, useValue: mockStore
        },
        {
          provide: UserNavigator, useValue: mockNavigation
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 'user id'}),
            queryParams: of({type: null})
          }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserContainerComponent);
    component = fixture.componentInstance;
    const user = {
      id: 'user id',
      displayName: 'displayName',
      password: 'password',
      roles: ['id1']
    };
    mockStore.pipe.and.returnValue(of([user]));
    fixture.detectChanges();
  });

  describe('initialize', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('call store.pipe to call select with getAuthenticatedUser selector', () => {
      expect(mockStore.pipe).toHaveBeenCalled();
    });
  });

  describe('#handleCancel', () => {
    it('should call UserNavigator.navigateToUser when click cancel button', () => {
      component.handleCancel();
      expect(mockNavigation.navigateToUser).toHaveBeenCalled();
    });
  });
});
