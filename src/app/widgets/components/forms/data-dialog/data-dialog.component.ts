import {Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {WidgetItem} from '../../../models/enums';
import {ThemeService} from '../../../../theme/theme.service';
import {Theme} from '../../../../theme/model/index';

@Component({
  selector: 'app-data-dialog',
  templateUrl: './data-dialog.component.html',
  styleUrls: ['./data-dialog.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DataDialogComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DataDialogComponent),
      multi: true
    }
  ]
})
export class DataDialogComponent implements OnInit {
  @Input() formTitle: string;
  @Input() formTitleType: string;
  @Input() inputData: any;
  @Output() saveHandler: EventEmitter<object>;
  @ViewChild('dimensionFilterContainer') dimensionFilterContainer;
  newForm: FormGroup;
  widgetItem = Object.keys(WidgetItem);
  isDimensionFilter: boolean;

  constructor(private themeService: ThemeService) {
    this.saveHandler = new EventEmitter();
  }

  ngOnInit() {
    this.isDimensionFilter = this.inputData.type === WidgetItem.Instance;
    this.newForm = new FormGroup({
        'item': new FormControl(this.inputData.selection),
      }
    );
  }

  onSave() {
    this.saveHandler.emit(this.newForm.value);
  }

  onCancel() {
    this.saveHandler.emit(null);
  }

  handleToggleAddInstance() {
    this.dimensionFilterContainer.triggerToggleAddInstance();
  }

  isDarkTheme() {
    return this.themeService.getCurrentTheme() === Theme.Dark;
  }
}
