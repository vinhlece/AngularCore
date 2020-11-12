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
import differenceWith from 'lodash/differenceWith';
import {ClickSelectedItemEvent} from '../../../models';
import {Agent, Queue, Region} from '../../../../common/models/constants';

export interface SelectionChangeEvent {
  value: any;
  selected: boolean;
}

@Component({
  selector: 'app-selection-panel',
  templateUrl: './selection-panel.component.html',
  styleUrls: ['./selection-panel.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectionPanelComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectionPanelComponent),
      multi: true
    }
  ]
})
export class SelectionPanelComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  private _items: any[] = [];
  private _addedItems: any[] = [];
  private lastestItem;

  form: FormGroup;

  @Input()
  get items(): any[] {
    return this._items;
  }

  set items(value: any[]) {
    this._items = this.removeAll(value, this._addedItems);
  }

  @Input()
  get addedItems(): any[] {
    return this._addedItems;
  }

  set addedItems(value: any[]) {
    this._addedItems = value;
    this._items = this.removeAll(this._items, this.addedItems);
  }

  @Output() onClickSelectedItem = new EventEmitter<ClickSelectedItemEvent>();

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      selectedAvailableItems: this._fb.control([]),
      selectedAddedItems: this._fb.control([])
    });
  }

  get enableAddBtn(): boolean {
    return this.form.value.selectedAvailableItems.length > 0;
  }

  get enableRemoveBtn(): boolean {
    return this.form.value.selectedAddedItems.length > 0;
  }

  get enableMoveUp(): boolean {
    if (this.form.value.selectedAddedItems.length > 0 && this.addedItems.length > 0) {
      return !this.form.value.selectedAddedItems.find(item => item.id === this.addedItems[0].id);
    }
    return false;
  }

  get enableMoveDown(): boolean {
    const lastPos = this.addedItems.length - 1;
    if (this.form.value.selectedAddedItems.length > 0 && this.addedItems.length > 0) {
      return !this.form.value.selectedAddedItems.find(item => item.id === this.addedItems[lastPos].id);
    }
    return false;
  }

  writeValue(value: any[]) {
    if (value) {
      this.addedItems = value;
      this.setPriority();
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

    return this.addedItems.length <= 0 ? err : null;
  }

  handleAdd() {
    const itemsToAdd = this.form.value.selectedAvailableItems;
    this.items = this.removeAll(this.items, itemsToAdd);
    this.addedItems = [...(this.addedItems || []), ...itemsToAdd];
    this.setPriority();
    this.emitEditedItems(this.addedItems);
    this._propagateChange(this.addedItems);
  }

  handleRemove() {
    const itemsToRemove = this.form.value.selectedAddedItems;
    this.addedItems = this.removeAll(this.addedItems, itemsToRemove);
    this.setPriority();
    this.items = [...this.items, ...this.form.value.selectedAddedItems];
    this._propagateChange(this.addedItems);
  }

  handleMoveUp() {
    for (let i = 0; i < this.addedItems.length; i++) {
      if (this.form.value.selectedAddedItems.includes(this.addedItems[i])) {
        this.moveItem(i, i - 1);
      }
    }
    this.setPriority();
    this.emitEditedItems(this.addedItems);
    this._propagateChange(this.addedItems);
  }

  handleMoveDown() {
    for (let i = this.addedItems.length - 1; i >= 0; i--) {
      if (this.form.value.selectedAddedItems.includes(this.addedItems[i])) {
        this.moveItem(i, i + 1);
      }
    }
    this.setPriority();
    this.emitEditedItems(this.addedItems);
    this._propagateChange(this.addedItems);
  }

  handleClickSelectedItem(item: any) {
    const index = item && item.group ? item.group.priority : null;
    this.lastestItem = item;
    this.onClickSelectedItem.emit({item, index});
  }

  isAddedItemSelected(value): boolean {
    return this.form.value.selectedAddedItems.find((item) => item.id === value.id);
  }

  emitEditedItems(itemArray: any[]) {
    if (this.lastestItem) {
      const item = itemArray.find(column => column.id === this.lastestItem.id);
      this.lastestItem = item;
    }
  }

  private _propagateChange = (_: any) => {
  };

  private removeAll(target: any[], items: any[]): any[] {
    return differenceWith(target, items, (a, b) => a.id === b.id);
  }

  private moveItem(from: number, to: number) {
    if (to < 0 || to >= this.addedItems.length) {
      return;
    }
    const temp = this.addedItems[from];
    this.addedItems[from] = this.addedItems[to];
    this.addedItems[to] = temp;
  }

  private setPriority() {
    const temp = this.addedItems.filter(item => item.type !== 'number');
    temp.forEach((column, index) => {
      if (!column.group) {
        column.group = {
          priority: null,
          enable: false
        };
      }
      column.group.priority = index;
    });
  }

  getDisplayValue(item) {
    const dimensionInstances = [Agent, Queue, Region];
    if (item.type === 'string' && dimensionInstances.findIndex(instance => instance === item.id) >= 0) {
      return item.id + ' (Key)';
    }
    return item.id;
  }
}
