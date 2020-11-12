import {DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {PlaceholderTitleComponent} from './placeholder-title.component';

describe('PlaceholderTitleComponent', () => {
  let fixture: ComponentFixture<PlaceholderTitleComponent>;
  let comp: PlaceholderTitleComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        PlaceholderTitleComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceholderTitleComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  }));

  describe('on double click', () => {
    it('should focus on double click', () => {
      comp.editable = true;
      fixture.detectChanges();
      const spy = spyOn(comp.input.nativeElement, 'focus');
      fixture.detectChanges();
      de.triggerEventHandler('dblclick', {});
      expect(comp.editable).toBeTruthy();
    });
  });

  describe('on press enter on input element', () => {
    it('should make input readonly and emit submit event if value is not empty', () => {
      const spy = spyOn(comp.onSubmit, 'emit');
      comp.editable = true;
      fixture.detectChanges();
      const control = comp.form.controls['title'];

      control.setValue('abc');
      const el = de.query(By.css('.input'));
      el.triggerEventHandler('keydown.enter', new KeyboardEvent('keydown', {key: 'Enter'}));

      expect(spy).toHaveBeenCalledWith('abc');
      expect(comp.editable).toBeTruthy();
    });

    it('should make input readonly but not emit submit event if value is empty', () => {
      const spy = spyOn(comp.onSubmit, 'emit');
      comp.title = 'abc';
      comp.editable = true;
      fixture.detectChanges();
      const control = comp.form.controls['title'];

      control.setValue('');
      const el = de.query(By.css('.input'));
      el.triggerEventHandler('keydown.enter', new KeyboardEvent('keydown', {key: 'Enter'}));

      expect(spy).toHaveBeenCalled();
      expect(comp.editable).toBeTruthy();
      expect(control.value).toEqual('');
    });
  });

  describe('on blur on input element', () => {
    it('should make input readonly and emit submit event when value is not empty', () => {
      const spy = spyOn(comp.onSubmit, 'emit');
      comp.editable = true;
      fixture.detectChanges();
      const control = comp.form.controls['title'];

      comp.form.controls['title'].setValue('abc');
      const el = de.query(By.css('.input'));
      el.triggerEventHandler('blur', {});

      expect(spy).not.toHaveBeenCalledWith('abc');
      expect(comp.editable).toBeFalsy();
    });

    it('should make input readonly but not emit submit event when value is empty', () => {
      const spy = spyOn(comp.onSubmit, 'emit');
      comp.title = 'abc';
      comp.editable = true;
      fixture.detectChanges();

      const control = comp.form.controls['title'];
      control.setValue('');
      const el = de.query(By.css('.input'));
      el.triggerEventHandler('blur', {});

      expect(spy).not.toHaveBeenCalled();
      expect(comp.editable).toBeFalsy();
      expect(control.value).toEqual(comp.title);
    });
  });
});
