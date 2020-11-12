import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormulaMeasure, Measure, Package} from '../../models';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';

@Component({
  selector: 'app-edit-formula-measure-form',
  templateUrl: './edit-formula-measure-form.component.html',
  styleUrls: ['./edit-formula-measure-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditFormulaMeasureFormComponent implements OnInit {
  private _fb: FormBuilder;
  private _themeService: ThemeService;

  form: FormGroup;

  @Input() packages: Package[] = [];
  @Input() packageMeasures: Measure[] = [];
  @Input() formulaMeasure: FormulaMeasure;
  @Input() allMeasureNames: string[] = [];

  @Output() onCancel: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<FormulaMeasure> = new EventEmitter();
  @Output() onChangePackage: EventEmitter<string> = new EventEmitter();

  constructor(fb: FormBuilder, themeService: ThemeService) {
    this._fb = fb;
    this._themeService = themeService;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this._fb.group({
      name: [this.formulaMeasure.name, [Validators.required, Validators.pattern('^[A-Za-z]+$'), this.availableName.bind(this)]],
      dataType: [this.formulaMeasure.dataType, Validators.required],
      expression: [this.formulaMeasure.expression, Validators.required]
    });
  }

  submit() {
    this.formulaMeasure = this.prepareFormula();
    this.onSave.emit(this.formulaMeasure);
  }

  prepareFormula(): FormulaMeasure {
    const inputMeasure = this.form.getRawValue();
    return {...this.formulaMeasure, ...inputMeasure};
  }

  changePackage(event) {
    this.onChangePackage.emit(event.value);
  }

  availableName(c: FormControl) {
    if (this.allMeasureNames.includes(c.value.toLowerCase())) {
      return {
        availableName: {
          valid: false
        }
      };
    }
    return null;
  }

  addMeasureToExpression(value) {
    const expression = this.form.getRawValue().expression;
    this.form.get('expression').setValue(expression + value);
  }

  isDarkTheme() {
    return this._themeService.getCurrentTheme() === Theme.Dark;
  }
}
