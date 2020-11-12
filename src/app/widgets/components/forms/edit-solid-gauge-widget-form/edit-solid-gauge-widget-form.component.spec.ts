import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {mockSolidGaugeWidget} from '../../../../common/testing/mocks/widgets';
import {EditSolidGaugeWidgetFormComponent} from './edit-solid-gauge-widget-form.component';

describe('EditSolidGaugeWidgetFormComponent', () => {
  let fixture: ComponentFixture<EditSolidGaugeWidgetFormComponent>;
  let comp: EditSolidGaugeWidgetFormComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditSolidGaugeWidgetFormComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditSolidGaugeWidgetFormComponent);
    comp = fixture.componentInstance;
    comp.widget = mockSolidGaugeWidget();
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
