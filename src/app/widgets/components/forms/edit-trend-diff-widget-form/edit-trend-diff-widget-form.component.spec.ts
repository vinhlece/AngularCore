import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {mockTrendDiffLineWidget} from '../../../../common/testing/mocks/widgets';
import {EditTrendDiffWidgetFormComponent} from './edit-trend-diff-widget-form.component';

describe('EditTrendDiffWidgetFormComponent', () => {
  let fixture: ComponentFixture<EditTrendDiffWidgetFormComponent>;
  let comp: EditTrendDiffWidgetFormComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditTrendDiffWidgetFormComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditTrendDiffWidgetFormComponent);
    comp = fixture.componentInstance;
    comp.widget = mockTrendDiffLineWidget();
    de = fixture.debugElement;
  }));

  it('should emit submit event on submit', () => {
    const spy = spyOn(comp.onSubmit, 'emit');
    fixture.detectChanges();
    const el = de.query(By.css('app-edit-widget-form'));
    el.triggerEventHandler('onSubmit', {});
    expect(spy).toHaveBeenCalled();
  });

  it('should emit change event on change', () => {
    const spy = spyOn(comp.onChange, 'emit');
    fixture.detectChanges();
    const el = de.query(By.css('app-edit-widget-form'));
    el.triggerEventHandler('onChange', {});
    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancel event on cancel', () => {
    const spy = spyOn(comp.onCancel, 'emit');
    fixture.detectChanges();
    const el = de.query(By.css('app-edit-widget-form'));
    el.triggerEventHandler('onCancel', {});
    expect(spy).toHaveBeenCalled();
  });
});
