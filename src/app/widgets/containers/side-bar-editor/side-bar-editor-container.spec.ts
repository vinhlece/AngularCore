import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Store} from '@ngrx/store';
import {SideBarEditorContainer} from './side-bar-editor-container';
import {mockWidget} from '../../../common/testing/mocks/widgets';
import {of} from 'rxjs/index';
import {WidgetType} from '../../constants/widget-types';

describe('SideBarEditorContainer', () => {
  let fixture: ComponentFixture<SideBarEditorContainer>;
  let comp: SideBarEditorContainer;
  let de: DebugElement;
  let store: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
      ],
      declarations: [
        SideBarEditorContainer
      ],
      providers: [
        {provide: Store, useValue: jasmine.createSpyObj('store', ['pipe'])},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarEditorContainer);
    de = fixture.debugElement;
    comp = fixture.componentInstance;
    store = TestBed.get(Store);
    const widget = mockWidget();
    widget.type = WidgetType.Bar;
    store.pipe.and.returnValue(of(widget));
  });

  it('should emit save action when fired handle save event', () => {
    fixture.detectChanges();
    const barWidget = de.query(By.css('app-edit-bar-widget'));
    const saveSpy = spyOn(comp.onSave, 'emit');
    barWidget.triggerEventHandler('onSave', {});
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit cancel action when fired handle cancel event', () => {
    fixture.detectChanges();
    const barWidget = de.query(By.css('app-edit-bar-widget'));
    const cancelSpy = spyOn(comp.onCancel, 'emit');
    barWidget.triggerEventHandler('onCancel', {});
    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });
});
