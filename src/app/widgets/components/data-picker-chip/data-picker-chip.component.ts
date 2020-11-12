import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {WidgetItem} from '../../models/enums';
import {isNullOrUndefined} from 'util';
import {FlexibleChoicePackage} from '../forms/flexible-choice-input/flexible-choice-package';

@Component({
  selector: 'app-data-picker-chip',
  templateUrl: './data-picker-chip.component.html',
  styleUrls: ['./data-picker-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataPickerChipComponent implements OnChanges, OnInit {
  @Input() type: string;
  @Input() selectedItems: string[];
  @Input() allItems: string[];
  @Input() showAllData;
  @Input() choiceMode: string;
  @Output() handleRemoveItem = new EventEmitter<any>();
  @Output() handleAddItem = new EventEmitter<any>();
  @Output() handleChangeShowAllInstance = new EventEmitter<boolean>();

  separatorKeysCodes: number[] = [ENTER];
  fruitCtrl = new FormControl();
  showAllDataCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  selectedItemVals: string[];
  title: string;
  inputSearch: string;
  widgetItem = WidgetItem;
  flexibleChoicePackage = FlexibleChoicePackage;
  _allItem: string[] = [];
  isDisable: boolean;

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {
  }

  ngOnInit(): void {
    this.allItems = this.allItems ? this.allItems : [];
    this.selectedItems = this.selectedItems ? this.selectedItems : [];
    this.selectedItemVals = this.selectedItems.map(x => x);
    if (this.type === this.widgetItem.Instance && this.selectedItemVals.length === 0 && !isNullOrUndefined(this.showAllData) && !isNullOrUndefined(this.showAllData.value)) {
      this.showAllDataCtrl.setValue(true);
      this.isDisable = true;
    }
    this.title = this.type === WidgetItem.Measure ? 'widgets.edit_widget_form.measure' : this.type === WidgetItem.Dimension ? 'widgets.edit_widget_form.dimension'
      : this.type === WidgetItem.Instance ? 'widgets.edit_widget_form.instance' : this.type === WidgetItem.Window ? 'widgets.edit_widget_form.window' : '';
    this.inputSearch = 'widgets.edit_widget_form.search';

    this.showAllDataCtrl.valueChanges.subscribe(isShow => {
      console.log(isShow);
      this.isDisable = isShow;
      if (isShow) {
        this.selectedItemVals = [];
      }
      this.handleChangeShowAllInstance.emit(isShow);
    });
  }

  ngOnChanges() {
	// Save selected items on the UI by map
    this.selectedItemVals = this.selectedItems && this.selectedItemVals && this.selectedItems.length !== this.selectedItemVals.length ? this.selectedItems.map(m => m) : this.selectedItemVals;
    if (this.allItems && this._allItem.length !== this.allItems.length) {
      this._allItem = this.allItems;
      this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this._allItem.slice()));
    }
    // check disable input value
    this.isDisable =  this.selectedItemVals && ((this.choiceMode && this.choiceMode === this.flexibleChoicePackage.SINGLE
      && this.selectedItemVals.length >= 1) || (this.type === this.widgetItem.Instance && this.showAllDataCtrl.value)) ? true : false;

    // check and select one value
    if ((this.type !== this.widgetItem.Instance || (this.type === this.widgetItem.Instance && !this.showAllDataCtrl.value))
      && this._allItem && this._allItem.length === 1 && this.selectedItemVals && (this.selectedItemVals.length === 0
        || (this.selectedItemVals.length === 1 && this.selectedItemVals[0] !== this._allItem[0]))) {
      setTimeout(() => {
        this.selectedItemVals = [];
        this.selectItem(this._allItem[0]);
      }, 10);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our item
    if (this.type === WidgetItem.Instance && (value || '').trim()) {
      this.selectedItemVals.push(value.trim());
      this.handleAddItem.emit({type: this.type, items: this.selectedItemVals});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.fruitCtrl.setValue(null);

  }

  remove(fruit: string): void {
    const index = this.selectedItemVals.indexOf(fruit);

    if (index >= 0) {
      this.selectedItemVals.splice(index, 1);
    }
    this.handleRemoveItem.emit({type: this.type, item: fruit});

    if (!isNullOrUndefined(this.showAllData) && this.selectedItemVals.length === 0) {
      this.showAllDataCtrl.setValue(true);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    this.selectItem(event.option.viewValue);
  }

  selectItem(val) {
    this.selectedItemVals.push(val);
    this.handleAddItem.emit({type: this.type, items: this.selectedItemVals});
  }

  getStyleForSeachBox = function() {
    return this.isDisable ? {'opacity': 0.5} : {'opacity': 1};
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this._allItem.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }
}
