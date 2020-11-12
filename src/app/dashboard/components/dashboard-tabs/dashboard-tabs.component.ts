import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Tab} from '../../models';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';
import {isNullOrUndefined} from '../../../common/utils/function';

export interface TabEvent {
  tab: Tab;
  isCurrentTab: boolean;
}

@Component({
  selector: 'app-dashboard-tabs',
  templateUrl: './dashboard-tabs.component.html',
  styleUrls: ['./dashboard-tabs.component.scss']
})
export class DashboardTabsComponent {
  /**
   * Current selected tab index, initialize to 0 which is the first tab,
   * this will be used to determine we should render tab editor for a tab or not,
   * in order to prevent gridstack service from emitting all grid item from all tabs when only one tab has placeholder changed.
   */
  addButtons: [string];
  selectedTabIdx: number = 0;
  isEmptyPlaceholder: boolean = false;
  private _tabs: Tab[];

  @Input() globalFilter: boolean;

  @Input()
  get tabs(): Tab[] {
    return this._tabs;
  }

  set tabs(data: Tab[]) {
    let refreshTab = (data && this._tabs && data.length > this._tabs.length);
    this._tabs = data;
    if (!this.addButtons) {
      this.addButtons = ['add'];
    }
    refreshTab = refreshTab || (this.tabs && this.selectedTabIdx === this.tabs.length);
    if (refreshTab) {
      this.selectedTabIdx = this._tabs.length - 1;
    }
    if (this._tabs && this._tabs.length > 0) {
      this.onGlobalFilters.emit(this._tabs[this.selectedTabIdx].globalFilters);
    }
    this.emptyPlaceholder();
  }

  get globalInstances(): string[] {
    return this._tabs[this.selectedTabIdx].globalFilters || [];
  }

  @Output() onSelectTab = new EventEmitter<TabEvent>();
  @Output() onAddTab = new EventEmitter<void>();
  @Output() onDeleteTab = new EventEmitter<TabEvent>();
  @Output() onAddInstance = new EventEmitter<string>();
  @Output() onRemoveInstance = new EventEmitter<any>();
  @Output() onGlobalFilters = new EventEmitter<string[]>();
  @Output() onMetricsSize = new EventEmitter<void>();

  constructor(private themeService: ThemeService) {}

  handleSelectTab(idx: number) {
    const tab = this.tabs[idx];
    if (tab) {
      const event: TabEvent = {tab, isCurrentTab: this.isCurrentTab(tab)};
      this.onSelectTab.emit(event);
      this.selectedTabIdx = idx;
    }
  }
  handleAddTab(event) {
    event.stopPropagation();
    this.onAddTab.emit();
  }

  handleDeleteTab(event, tab: Tab) {
    event.stopPropagation();
    this.onDeleteTab.emit({tab, isCurrentTab: this.isCurrentTab(tab)});
  }

  trackByFn(idx: number, tab: Tab) {
    return tab.id;
  }

  handleAddInstance(event: any) {
    this.onAddInstance.emit(this._tabs[this.selectedTabIdx].id);
  }

  handleRemoveInstance(instance: string) {
    const data = {
      id: this._tabs[this.selectedTabIdx].id,
      instance: instance
    };
    this.onRemoveInstance.emit(data);
  }

  handleMetricsSize(event: any) {
    this.onMetricsSize.emit();
  }

  isDarkTheme() {
    return this.themeService.getCurrentTheme() === Theme.Dark;
  }

  private emptyPlaceholder() {
    if (this._tabs) {
      this.isEmptyPlaceholder = !(this.tabs.length > 0 && this.tabs[0].placeholders && this.tabs[0].placeholders.length > 0);
    }
  }

  private isCurrentTab(tab: Tab): boolean {
    return this.tabs[this.selectedTabIdx]
      && tab.id === this.tabs[this.selectedTabIdx].id;
  }
}
