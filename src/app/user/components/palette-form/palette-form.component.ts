import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder, FormControl, FormGroup,
  Validators
} from '@angular/forms';
import {isUndefined} from 'util';
import {Observable} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/internal/operators';
import {ColorPalette} from '../../../common/models/index';
import {Location} from '@angular/common';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';

@Component({
  selector: 'app-palette-form',
  templateUrl: './palette-form.component.html',
  styleUrls: ['./palette-form.component.scss']
})
export class PaletteFormComponent implements OnInit, OnChanges {
  private _fb: FormBuilder;
  private _themeService: ThemeService;
  form: FormGroup;
  thresholdColors: string[] = Array.from(Array(3));
  paletteColors: string[] = Array.from(Array(5));

  @Input() errorMessage$: Observable<string>;
  @Input() currentPalette: ColorPalette;
  @Output() savePalette = new EventEmitter<ColorPalette>();

  constructor(fb: FormBuilder, private location: Location, themeService: ThemeService) {
    this._fb = fb;
    this._themeService = themeService;
  }

  get nodes(): FormArray {
    return this.form.get('colors') as FormArray;
  }

  ngOnInit() {
    const validatorFns = [Validators.required];
    this.form = this._fb.group({
      colors: this._fb.array(this.paletteColors, [...validatorFns, Validators.minLength(5)]),
      name: [null, validatorFns],
      threshold: this._fb.array(this.thresholdColors, validatorFns),
      headerFont: this._fb.control([])
    });

    if (isUndefined(this.errorMessage$)) {
      this.errorMessage$ = null;
    }
  }

  ngOnChanges() {
    if (this.currentPalette && this.form) {
      Object.keys(this.form.controls).forEach((controlName: any) => {
        const control = this.getControl(controlName);
        control.patchValue(this.currentPalette[controlName], {emitEvent: false});
      });
    }
  }

  handleAddNode() {
    this.nodes.push(this._fb.control(this.createNode(), [Validators.required]));
  }

  handleRemoveNode(index: number) {
    this.nodes.removeAt(index);
  }

  private _propagateChange = (_: any) => {
    // no op
  }

  private createNode(): string {
    return null;
  }

  handleBlur() {
    this._propagateChange(this.form.value.name);
  }

  isDarkTheme() {
    return this._themeService.getCurrentTheme() === Theme.Dark;
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.form.value as ColorPalette;
      if (this.currentPalette) {
        data.id = this.currentPalette.id;
        data.userId = this.currentPalette.id;
      }
      this.savePalette.emit(data);
    }
  }

  handleCancel() {
    this.location.back();
  }

  private getControl(controlName: string): AbstractControl {
    return this.form.get(controlName);
  }
}
