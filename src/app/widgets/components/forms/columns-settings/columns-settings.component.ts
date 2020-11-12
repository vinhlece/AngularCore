import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator
} from '@angular/forms';
import {ClickSelectedItemEvent, Column} from '../../../models';
import {Subject} from 'rxjs/index';

@Component({
  selector: 'app-columns-settings',
  templateUrl: './columns-settings.component.html',
  styleUrls: ['./columns-settings.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColumnsSettingsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ColumnsSettingsComponent),
      multi: true
    }
  ]
})
export class ColumnsSettingsComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;

  form: FormGroup;

  @Input() editColumn: Subject<Column>;
  @Input() availableColumns: Column[];
  @Output() onColumnChange = new EventEmitter<Column>();

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      addedColumns: null,
      editingColumn: null
    });
    this.form.valueChanges.subscribe((value) => {
      const updateColumns = value.addedColumns.map(item => {
        if (value.editingColumn && item.id === value.editingColumn.id) {
          return value.editingColumn;
        }
        return item;
      });
      this._propagateChange(updateColumns);
    });

    if (this.editColumn) {
      this.editColumn.subscribe(editingColumn => {
        const updateColumns = this.form.get('addedColumns').value.map(item => {
          if (editingColumn && item.id === editingColumn.id) {
            return editingColumn;
          }
          return item;
        });
        this._propagateChange(updateColumns);
      });
    }
  }

  writeValue(addedColumns: Column[]) {
    if (addedColumns) {
      this.form.patchValue({addedColumns}, {emitEvent: false});
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  validate(control: AbstractControl): { [key: string]: any } {
    const err = {
      required: true
    };

    return this.form.invalid ? err : null;
  }

  handleClickSelectedItem(event: ClickSelectedItemEvent) {
    const editingColumn: Column = {
      ...event.item,
      group: event.item && event.item.group ? {...event.item.group, priority: event.index} : {enable: false, priority: event.index}
    };

    this.onColumnChange.emit(editingColumn);
  }

  private _propagateChange = (_: any) => {
  };
}
