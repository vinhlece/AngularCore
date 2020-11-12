import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AbstractControl, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ThresholdLineInputComponent} from './threshold-line-input.component';

class Page {
  enableControl: AbstractControl;
  valueControl: AbstractControl;

  constructor(private fixture: ComponentFixture<ThresholdLineInputComponent>) {
  }

  setControls() {
    const component = this.fixture.componentInstance;
    this.enableControl = component.form.get('enable');
    this.valueControl = component.form.get('value');
  }
}

xdescribe('ThresholdLineInputComponent', () => {
  let fixture: ComponentFixture<ThresholdLineInputComponent>;
  let component: ThresholdLineInputComponent;
  let page: Page;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatCheckboxModule,
      ],
      declarations: [
        ThresholdLineInputComponent,
      ],
      providers: [
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdLineInputComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    page = new Page(fixture);
    page.setControls();
  });

  it('threshold value input should be readonly when threshold enable is false', () => {
    page.enableControl.setValue(false);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('input'));
    expect(el.nativeElement.style.readonly).toBe(true);
  });

  it('threshold value input should NOT be readonly when threshold enable is false', () => {
    page.enableControl.setValue(true);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('input'));
    expect(el.nativeElement.style.readonly).toBe(false);
  });
});
