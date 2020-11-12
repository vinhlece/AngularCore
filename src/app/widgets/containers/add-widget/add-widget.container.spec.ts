import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Store} from '@ngrx/store';
import * as navigationActions from '../../../layout/actions/navigation.actions';
import {mockWidget} from '../../../common/testing/mocks/widgets';
import * as widgetsActions from '../../actions/widgets.actions';
import {WIDGETS_FACTORY} from '../../services/tokens';
import {WidgetsFactoryImpl} from '../../services/widgets.factory';
import {AddWidgetContainer} from './add-widget.container';
import {of} from 'rxjs/index';

describe('AddWidgetContainer', () => {
  let fixture: ComponentFixture<AddWidgetContainer>;
  let comp: AddWidgetContainer;
  let de: DebugElement;
  let store: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddWidgetContainer],
      providers: [
        {provide: Store, useValue: jasmine.createSpyObj('store', ['pipe', 'dispatch'])},
        {provide: WIDGETS_FACTORY, useClass: WidgetsFactoryImpl}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWidgetContainer);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    store = TestBed.get(Store);
  });

  describe('submit', () => {
    it('should dispatch add widget action', () => {
      store = TestBed.get(Store);
      store.pipe.and.returnValues(of(null));
      const form = de.query(By.css('app-add-widget-form'));
      form.triggerEventHandler('onSubmit', mockWidget());
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(widgetsActions.AddAndNavigate));
    });
  });

  describe('cancel', () => {
    it('should dispatch navigate action', () => {
      store.pipe.and.returnValues(of(null));
      const form = de.query(By.css('app-add-widget-form'));
      form.triggerEventHandler('onCancel', {});
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(navigationActions.NavigateTo));
    });
  });
});
