import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {mockPlaceholder} from '../../../common/testing/mocks/dashboards';
import * as placeholdersActions from '../../../dashboard/actions/placeholders.actions';
import * as embeddedActions from '../../actions/embedded.actions';
import {WidgetLauncherWrapperContainer} from './widget-launcher-wrapper.container';

describe('WidgetLauncherWrapperContainer', () => {
  let fixture: ComponentFixture<WidgetLauncherWrapperContainer>;
  let comp: WidgetLauncherWrapperContainer;
  let store: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetLauncherWrapperContainer],
      providers: [
        {provide: Store, useValue: jasmine.createSpyObj('store', ['pipe', 'dispatch'])}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetLauncherWrapperContainer);
    comp = fixture.componentInstance;
    comp.placeholderId = 'abc';

    store = TestBed.get(Store);
    store.pipe.and.returnValue(of(mockPlaceholder()));
  });

  describe('init', () => {
    it('should dispatch start session action', () => {
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith(new embeddedActions.StartSession());
    });

    it('should dispatch set launcher size action', () => {
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(embeddedActions.SetLauncherSize));
    });

    it('should dispatch load placeholder by id action', () => {
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith(new placeholdersActions.Load('abc'));
    });
  });
});
