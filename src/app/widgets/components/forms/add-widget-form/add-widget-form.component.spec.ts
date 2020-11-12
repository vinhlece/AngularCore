import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {AddWidgetFormComponent} from './add-widget-form.component';
import {TranslateModule} from '@ngx-translate/core';

describe('AddWidgetFormComponent', () => {
  let fixture: ComponentFixture<AddWidgetFormComponent>;
  let comp: AddWidgetFormComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          TranslateModule.forRoot()
        ],
        declarations: [AddWidgetFormComponent],
        providers: [FormBuilder],
        schemas: [NO_ERRORS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWidgetFormComponent);
    de = fixture.debugElement;
    comp = fixture.componentInstance;
  });

  describe('next', () => {
    it('should emit event when submit', () => {
      const spy = spyOn(comp.onSubmit, 'emit');
      fixture.detectChanges();
      comp.handleSubmit();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('cancel', () => {
    it('should emit event when cancel button click', () => {
      const spy = spyOn(comp.onCancel, 'emit');
      fixture.detectChanges();
      const btn = de.query(By.css('.btn-cancel'));
      btn.triggerEventHandler('click', {});
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
