import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CallTimeLineWidget} from '../../../../widgets/models/index';
import { MatChipInputEvent } from '@angular/material/chips';
import {CallTimeLineGroupBy} from '../../../../widgets/models/enums';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-call-timeline-filter-bar',
  templateUrl: './call-timeline-fiter-bar.component.html',
  styleUrls: ['./call-timeline-fiter-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CallTimelineFiterBarComponent implements OnInit, OnChanges {
  private _searchOptions = Object.keys(CallTimeLineGroupBy)
    .map(item => `${item}:`);

  autoCompleteOptions: string[] = this._searchOptions;
  searchList: string[] = [];

  @Input() widget: CallTimeLineWidget;

  @Output() onSearchChange: EventEmitter<string[]> = new EventEmitter();

  ngOnInit() {
    this.initSearchList();
  }

  ngOnChanges() {
    this.initSearchList();
  }

  handleSearchChange(event) {
    const value = (<HTMLInputElement>event.target).value.trim().toLowerCase();
    this.autoCompleteOptions = this._searchOptions.filter(
      option => option.toLowerCase().includes(value)
    );
  }

  handleAddSearch(event: MatChipInputEvent) {
    if (event.value) {
      const value = event.value;
      if (this.isSearchInputValid(value)) {
        this.searchList.push(value);
      }
    }
    event.input.value = '';
    this.handleSearch();
  }

  handleRemoveSearch(value) {
    const index = this.searchList.indexOf(value);
    if (index >= 0) {
      this.searchList.splice(index, 1);
    }
    this.handleSearch();
  }

  private handleSearch() {
    this.onSearchChange.emit(this.searchList);
  }

  private isSearchInputValid(value: string): boolean {
    const searchValue = value.split(':')[1];
    return !isNullOrUndefined(searchValue) && searchValue.trim().length > 0;
  }

  private initSearchList() {
    this.searchList = [];
    const {agents, queues, segmentTypes, filters} = this.widget;
    if (agents && agents.length > 0) {
      agents.forEach(agent => {
        this.searchList.push(`Agent:${agent}`);
      });
    }
    if (queues && queues.length > 0) {
      queues.forEach(queue => {
        this.searchList.push(`Queue:${queue}`);
      });
    }
    if (segmentTypes && segmentTypes.length > 0) {
      segmentTypes.forEach(segmentType => {
        this.searchList.push(`SegmentType:${segmentType}`);
      });
    }
    if (filters && filters.length > 0) {
      filters.forEach(filter => {
        this.searchList.push(filter);
      });
    }
  }
}
