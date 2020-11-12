import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {mockLineWidget} from '../../../../common/testing/mocks/widgets';
import {EditLineWidgetFormComponent} from './edit-line-widget-form.component';

describe('EditLineWidgetFormComponent', () => {
  let fixture: ComponentFixture<EditLineWidgetFormComponent>;
  let comp: EditLineWidgetFormComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditLineWidgetFormComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditLineWidgetFormComponent);
    comp = fixture.componentInstance;
    comp.widget = mockLineWidget();
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
