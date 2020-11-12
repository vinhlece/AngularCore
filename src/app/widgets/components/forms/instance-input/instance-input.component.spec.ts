// import {DebugElement} from '@angular/core';
// import {async, ComponentFixture, TestBed} from '@angular/core/testing';
// import {FormArray, FormControl, ReactiveFormsModule} from '@angular/forms';
// import {MatChipsModule, MatIconModule, MatInputModule} from '@angular/material';
// import {By} from '@angular/platform-browser';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {StringInputComponent} from './instance-input.component';
//
// describe('StringInputComponent', () => {
//   let fixture: ComponentFixture<StringInputComponent>;
//   let comp: StringInputComponent;
//   let de: DebugElement;
//
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         ReactiveFormsModule,
//         BrowserAnimationsModule,
//         MatInputModule,
//         MatIconModule,
//         MatChipsModule
//       ],
//       declarations: [StringInputComponent]
//     });
//   }));
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(StringInputComponent);
//     comp = fixture.componentInstance;
//     de = fixture.debugElement;
//   });
//
//   describe('render', () => {
//     it('should show text box in single choice mode', () => {
//       comp.mode = 'single';
//       comp.options = ['a', 'b', 'c'];
//       fixture.detectChanges();
//       const element = de.query(By.css('input'));
//       expect(element).not.toBeNull();
//     });
//
//     it('should show a list of chips in multiple choices mode', () => {
//       comp.mode = 'multiple';
//       comp.options = ['a', 'b', 'c'];
//       comp.selectedOptions = ['a'];
//       fixture.detectChanges();
//       const elements = de.queryAll(By.css('mat-chip'));
//       expect(elements).not.toBeNull();
//       expect(elements.length).toEqual(1);
//     });
//   });
//
//   describe('form creation', () => {
//     it('should create instances form control in single choice mode', () => {
//       comp.mode = 'single';
//       comp.options = ['a', 'b', 'c'];
//       fixture.detectChanges();
//       expect(comp.form.get('instances')).toEqual(jasmine.any(FormControl));
//     });
//
//     it('should create instances form array in multiple choices mode', () => {
//       comp.mode = 'multiple';
//       comp.options = ['a', 'b', 'c'];
//       fixture.detectChanges();
//       expect(comp.form.get('instances')).toEqual(jasmine.any(FormArray));
//     });
//
//     it('should change instances form control value when selected options is changed from parent form group', () => {
//       comp.mode = 'single';
//       comp.options = ['a', 'b', 'c'];
//       comp.selectedOptions = ['a'];
//       fixture.detectChanges();
//
//       const control = comp.form.get('instances');
//       expect(control.value).toEqual('a');
//     });
//
//     it('should change instances form array value when selected options is changed from parent form group', () => {
//       comp.mode = 'multiple';
//       comp.options = ['a', 'b', 'c'];
//       comp.selectedOptions = ['a', 'b'];
//       fixture.detectChanges();
//
//       const control = comp.form.get('instances');
//       expect(control.value).toEqual(['a', 'b']);
//     });
//   });
//
//   describe('add chip', () => {
//     let instancesControl: FormArray;
//
//     beforeEach(() => {
//       comp.mode = 'multiple';
//       comp.options = ['a', 'b', 'c'];
//       fixture.detectChanges();
//       instancesControl = comp.form.get('instances') as FormArray;
//     });
//
//     it('should add new instance if it is not exist and have non-whitespace character', () => {
//       const instancesInput = de.query(By.css('input'));
//       instancesInput.triggerEventHandler('matChipInputTokenEnd', {input: {}, value: 'a'});
//       expect(instancesControl.value).toContain('a');
//     });
//
//     it('should not add new instance if it is already in the list', () => {
//       const instancesInput = de.query(By.css('input'));
//       instancesControl.push(new FormControl('a'));
//       const expected = instancesControl.value;
//
//       instancesInput.triggerEventHandler('matChipInputTokenEnd', {input: {}, value: 'a'});
//       expect(instancesControl.value).toEqual(expected);
//     });
//
//     it('should not add new instance if it does not contain any non-whitespace character', () => {
//       const instancesInput = de.query(By.css('input'));
//       const expected = instancesControl.value;
//
//       instancesInput.triggerEventHandler('matChipInputTokenEnd', {input: {}, value: '    '});
//       expect(instancesControl.value).toEqual(expected);
//     });
//
//     it('should reset input element value', () => {
//       const event = {input: {value: 'a'}, measureValue: 'a'};
//       const instancesInput = de.query(By.css('input'));
//       instancesInput.triggerEventHandler('matChipInputTokenEnd', event);
//       expect(event.input.value).toEqual('');
//     });
//   });
//
//   describe('on change', () => {
//     it('should set selected options when form value changed', () => {
//       comp.mode = 'single';
//       comp.options = ['a', 'b', 'c'];
//       comp.selectedOptions = ['a'];
//       fixture.detectChanges();
//
//       const instancesControl = comp.form.get('instances');
//       instancesControl.setValue('b');
//
//       expect(comp.selectedOptions = ['b']);
//     });
//   });
// });
