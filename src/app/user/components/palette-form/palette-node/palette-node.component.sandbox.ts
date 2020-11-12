import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {EMPTY, of} from 'rxjs';
import {ColorPickerModule} from 'ngx-color-picker';
import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PaletteNodeComponent} from './palette-node.component';

@Component({
  selector: 'app-palette-node-sandbox',
  template: `
    <div [formGroup]="form">
      <app-palette-node formControlName="color" [placeHolder]="'palette test'"></app-palette-node>
    </div>
  `
})
class PaletteNodeComponentSandbox implements OnInit {
  form: FormGroup;
  color: string;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      color: this._fb.control('#010101',[])
    });
  }
}

export default sandboxOf(PaletteNodeComponentSandbox, {
  imports: [
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ColorPickerModule
  ],
  declarations: [PaletteNodeComponent],
  providers: [
    {provide: Location, useValue: Location}
  ]
})
  .add('generate palette node controls', {
    template: `<app-palette-node-sandbox></app-palette-node-sandbox>`,
  });

