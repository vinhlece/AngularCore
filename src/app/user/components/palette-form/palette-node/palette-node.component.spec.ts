import {CommonModule} from '@angular/common';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Component, DebugElement, OnInit} from '@angular/core';
import {PaletteNodeComponent} from './palette-node.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {By} from '@angular/platform-browser';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <app-palette-node [placeHolder]="'some color'" formControlName="color"></app-palette-node>
    </div>
  `
})
class TestComponent implements OnInit {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      color: this._fb.control([null, null, null])
    });
  }
}

describe('PaletteNodeComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let comp: TestComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent,
        PaletteNodeComponent
      ],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatInputModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        ColorPickerModule
      ],
      providers: [
      ]

    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  }));

  it('#validation valid', () => {
    fixture.detectChanges();
    comp.form.get('color').setValue('#010101');
    expect(comp.form.valid).toBeTruthy();
  });

  it('#validation invalid', () => {
    fixture.detectChanges();
    comp.form.get('color').setValue('');
    expect(comp.form.invalid).toBeTruthy();
  });

  it('should show placeholder', () => {
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('input'));
    expect(el.attributes['placeholder']).toEqual('some color');
  });
});
