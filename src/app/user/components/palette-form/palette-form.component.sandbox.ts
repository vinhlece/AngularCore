import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatDividerModule, MatIconModule, MatInputModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {EMPTY, of} from 'rxjs';
import {PaletteFormComponent} from './palette-form.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {PaletteNodeComponent} from './palette-node/palette-node.component';
import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-palette-form-sandbox',
  template: `
    <div>
      <app-palette-form [formGroup]="form"></app-palette-form>
    </div>
  `
})
class PaletteColorComponentSandbox implements OnInit {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      nodes: this._fb.array(['#000000', '#111111', '#222222', '#333333', '#444444']),
      paletteName: this._fb.control('paletteName'),
      thresholdColors: this._fb.array(['#000000', '#111111', '#222222'])
    });
  }
}

export default sandboxOf(PaletteFormComponent, {
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ColorPickerModule,
    FlexLayoutModule
  ],
  declarations: [PaletteNodeComponent],
  providers: [
    {provide: Location, useValue: Location}
  ]
})
  .add('display palette name, palette colors and threshold colors configuration', {
    template: `<app-palette-form [errorMessage$]="errorMessageObservable">`,
    context: {
      errorMessageObservable: EMPTY
    }
  })
  .add('display invalid palette error', {
    template: `<app-palette-form [errorMessage$]="errorMessageObservable">`,
    context: {
      errorMessageObservable: of('Can not save palette configuration.')
    }
  });

