import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MeasureFormComponent} from './measure-form.component';
import {DebugElement} from '@angular/core';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';

describe('Measure form',  () => {
  let fixture: ComponentFixture<MeasureFormComponent>;
  let comp: MeasureFormComponent;
  let de: DebugElement;

  beforeEach(() => {
   TestBed.configureTestingModule({
     imports: [
       TranslateModule.forRoot()
     ],
     declarations: [MeasureFormComponent],
     providers: [FormBuilder],
     schemas: [NO_ERRORS_SCHEMA]
   });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureFormComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it('should emit cancel event', () => {
    const spy = spyOn(comp.onCancel, 'emit');
    fixture.detectChanges();
    const btn = de.query(By.css('.btn-cancel'));
    btn.triggerEventHandler('click', {});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit event when submit', () => {
    const spy = spyOn(comp.onSubmit, 'emit');
    fixture.detectChanges();
    comp.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
