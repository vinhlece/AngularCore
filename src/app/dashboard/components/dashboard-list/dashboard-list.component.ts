import {
  AfterViewInit,
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ContextMenuEvent} from '../../../layout/components/context-menu/context-menu.component';
import {Dashboard, DashboardStatus, Tab} from '../../models';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';
import {isNullOrUndefined} from '../../../common/utils/function';
import {Widget} from '../../../widgets/models/index';
import * as _ from 'lodash';
import {User} from '../../../user/models/user';
import {DashboardFilter} from '../../models/enums';

@Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss']
})
export class DashboardListComponent implements OnInit, OnChanges {
  displayedColumns = ['index', 'dashboardName'];
  dataSource: MatTableDataSource<Dashboard> = new MatTableDataSource([]);
  selectedRow: any;
  contextMenuEvent: ContextMenuEvent;
  options = ['Newest', 'Oldest'];
  total_data = {};
  filterData: any = {
    measures: [],
    dimensions: [],
    windows: [],
    widgets: []
  };
  filterType: DashboardFilter;
  readonly dashboardFilter = DashboardFilter;
  private _searchText: string;
  private _filterText: string;
  private _displayDashboards: Dashboard[];
  private _searchDashBoard: string[];

  @Input() dashboards: Dashboard[];
  @Input() tabs: Tab[];
  @Input() widgets: Widget[];
  @Input() user: User;
  @Output() deleteDashboardEventEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Output() addDashboard = new EventEmitter<void>();
  @Output() onRenameDashboard = new EventEmitter<Dashboard>();
  @Output() onCopyDashboard = new EventEmitter<Dashboard>();
  @ViewChild(MatSort) private sort: MatSort;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.dataSource.data = this.dashboards;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data, header) => this.getValueToSort(data, header);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!isNullOrUndefined(this.dataSource)) {
      this.dataSource.data = this.dashboards;
    }

    const dashboardChange = changes['dashboards'];
    const tabChange = changes['tabs'];
    const widgetChange = changes['widgets'];

    // get all dashboards information
    if (this.dashboards && this.tabs && this.widgets) {
      if ((Object.keys(this.total_data).length !== this.dashboards.length || !this.hasTotalData()) ||
        this.isInputChanged(dashboardChange) || this.isInputChanged(tabChange) || this.isInputChanged(widgetChange)) {
        this.dashboards.forEach(dashboard => {
          this.total_data[dashboard.id] = {};
          this.total_data[dashboard.id]['name'] = dashboard.name;
          if (dashboard.description) {
            this.total_data[dashboard.id]['description'] = dashboard.description;
          }
          const tab: Tab = this.getTabFromDashboard(dashboard.id);
          if (tab) {
            const placeholders = tab.placeholders;
            if (placeholders) {
              const widgetIds: string[] = placeholders.map(placeholder => placeholder.widgetId);
              this.total_data[dashboard.id]['widgets'] = _.union(this.total_data[dashboard.id]['widgets'],
                this.widgets.filter(widgets => widgetIds.indexOf(widgets.id) > -1));
              placeholders.forEach(placeholder => {
                const widget: Widget = this.widgets.find(item => item.id === placeholder.widgetId);
                if (widget) {
                  this.total_data[dashboard.id]['dimensions'] = widget.dimensions ?
                    _.union(this.total_data[dashboard.id]['dimensions'], widget.dimensions.map(d => d.dimension)) : [];
                  this.total_data[dashboard.id]['measures'] = widget.measures ?
                    _.union(this.total_data[dashboard.id]['measures'], widget.measures) : [];
                  this.total_data[dashboard.id]['windows'] = widget.windows ?
                    _.union(this.total_data[dashboard.id]['windows'], widget.windows) : [];
                }
              });
            }
          }
        });
        this.filterData = this.getTotalData();
      }
    }
  }

  isInputChanged(change): boolean {
    return change && change.currentValue !== change.previousValue;
  }

  hasTotalData () {
    return Object.keys(this.total_data).length !== 0;
  }

  getRecentDashboard() {
    // get recent dashboard
    const storage = localStorage.getItem('dashboards');
    if (this.user && this.dashboards && storage) {
      const data = JSON.parse(storage);
      if (data[this.user.id]) {
        return this.dashboards.filter(dashboard => data[this.user.id].includes(dashboard.id)).reverse().slice(0, 4);
      }
    } else {
      return [];
    }
  }

  getTabFromDashboard(id: string) {
    return this.tabs.find(tab => tab.dashboardId === id);
  }

  getTotalData(text?: any) {
    this._searchDashBoard = [];
    const temp = {
      measures: [],
      dimensions: [],
      windows: [],
      widgets: []
    };

    this._searchText = null;
    this._filterText = null;
    if (typeof text === 'string') {
      delete this.total_data[text];
    } else if (typeof text === 'object') {
      if (text['search']) {
        this._searchText = text['search'];
      } else if (text['filter']) {
        this._filterText = text['filter'];
      }
    }

    if (this.hasTotalData()) {
      // sum dashboard details
      return Object.keys(this.total_data).reduce((acc, dashboard) => {
        const data = {
          measures: _.union(acc['measures'], this.total_data[dashboard]['measures']),
          dimensions: _.union(acc['dimensions'], this.total_data[dashboard]['dimensions']),
          windows: _.union(acc['windows'], this.total_data[dashboard]['windows']),
          widgets: _.union(acc['widgets'], this.total_data[dashboard]['widgets'])
        }
        if (isNullOrUndefined(this._searchText) && isNullOrUndefined(this._filterText)) {
          return data;
        } else if (this._searchText && this.checkSearch(this.total_data[dashboard])) {
          // get dashboard from search input
          this._searchDashBoard.push(dashboard);
          return data;
        } else if (this._filterText) {
          if (this.total_data[dashboard]['widgets']) {
            // get dashboard from filter mat-chip
            switch (this.filterType) {
              case DashboardFilter.Widget: {
                if (this.total_data[dashboard]['widgets'].find(w => w.type === this._filterText)) {
                  this._searchDashBoard.push(dashboard);
                  return data;
                }
                break;
              }
              case DashboardFilter.Dimension: {
                const dimensionList = this.total_data[dashboard]['dimensions'];
                if (dimensionList && dimensionList.find(d => d === this._filterText)) {
                  this._searchDashBoard.push(dashboard);
                  return data;
                }
                break;
              }
              case DashboardFilter.Measure: {
                const measureList = this.total_data[dashboard]['measures'];
                if (measureList && measureList.find(m => m === this._filterText)) {
                  this._searchDashBoard.push(dashboard);
                  return data;
                }
                break;
              }
              case DashboardFilter.Window: {
                const windowList = this.total_data[dashboard]['windows'];
                if (windowList && windowList.find(w => w === this._filterText)) {
                  this._searchDashBoard.push(dashboard);
                  return data;
                }
                break;
              }
            }
          }

          return acc;
        } else {
          return acc;
        }
      }, temp);
    }
    return temp;
  }

  getFilterChip() {
    // get chip list from the total data
    if (this.hasTotalData() && this.filterType) {
      switch (this.filterType) {
        case DashboardFilter.Widget: {
          return _.uniq(this.filterData.widgets.map((widget: Widget) => widget.type));
        }
        case DashboardFilter.Dimension:
        case DashboardFilter.Measure:
        case DashboardFilter.Window: {
          return _.uniq(this.filterData[this.filterType]);
        }
      }
    } else {
      return [];
    }
  }

  getChipStyle(value: string) {
    if (this._filterText && this._filterText === value) {
      return {
        'opacity': '.5'
      };
    }
  }

  clearFilter() {
    this._displayDashboards = [];
  }

  checkSearch (dashboard: any) {
    const searchText = this._searchText.toLowerCase();
    if (Object.keys(dashboard).length === 1 && dashboard['name']) {
      if (dashboard['description']) {
        return this.searchName(dashboard, 'name', searchText) ||
          this.searchName(dashboard, 'description', searchText);
      }
      return this.searchName(dashboard, 'name', searchText);
    }
    if (isNullOrUndefined(dashboard['measures'])) {
      return;
    }

    return this.searchObject(dashboard, 'measures', searchText) ||
      this.searchObject(dashboard, 'dimensions', searchText) ||
      this.searchObject(dashboard, 'windows', searchText) ||
      dashboard['widgets'].find(widget => widget.name.toLowerCase().includes(searchText)) ||
      this.searchName(dashboard, 'name', searchText) ||
      this.searchName(dashboard, 'description', searchText);

    // return dashboard['measures'].find((measure: string) => measure.toLowerCase().includes(searchText)) ||
    //   dashboard['dimensions'].find((dimension: string) => dimension.toLowerCase().includes(searchText)) ||
    //   dashboard['windows'].find((window: string) => window.toLowerCase().includes(searchText)) ||
    //   dashboard['widgets'].find(widget => widget.name.toLowerCase().includes(searchText)) ||
    //   dashboard['name'].toLowerCase().includes(searchText) ||
    //   dashboard['description'].toLowerCase().includes(searchText);
  }

  searchObject(dashboard, property: string, searchText: string) {
    return dashboard[property].find((p: string) => p.toLowerCase().includes(searchText));
  }

  searchName(dashboard, name: string, searchText: string) {
    return dashboard[name] ? dashboard[name].toLowerCase().includes(searchText) : false;
  }

  getDisplayDashboard(event?: any) {
    // get dashboard to display in UI
    if (event) {
      this._searchDashBoard = [];
      if (event.keyCode === 13) {
        if (event.target.value) {
          setTimeout(() => {
            this.filterData = this.getTotalData({search: event.target.value});
            this._displayDashboards = this.dashboards.filter(dashboard =>
              this._searchDashBoard.find(search => search === dashboard.id)
            );
          }, 0);
          return this._displayDashboards;
        } else {
          this.filterData = this.getTotalData()
          this._displayDashboards = [];
        }
      }

      if (event.type === 'click') {
        setTimeout(() => {
          this.filterData = this.getTotalData({filter: event.target.textContent.trim()});
          this._displayDashboards = this.dashboards.filter(dashboard =>
            this._searchDashBoard.find(search => search === dashboard.id)
          );
        }, 0);
        return this._displayDashboards;
      }
    }
    return this._displayDashboards ? this._displayDashboards : this.dashboards;
  }

  handleShowContextMenu(event, row) {
    event.preventDefault();
    this.selectedRow = row;
    this.contextMenuEvent = {
      type: event.type,
      target: event.target as HTMLElement,
      clientX: event.clientX,
      clientY: event.clientY
    };
  }

  handleDeleteDashboard(id) {
    this.getTotalData(id);
    this.deleteDashboardEventEmitter.emit(id);
  }


  addNewDashboard() {
    this.addDashboard.emit();
  }

  renameDashboard(dashboard: Dashboard) {
    this.onRenameDashboard.emit(dashboard);
  }

  copyDashboard(dashboard: Dashboard) {
    this.onCopyDashboard.emit(dashboard);
  }

  preventRouter(event) {
    event.stopPropagation();
    return;
  }

  isDarkTheme() {
    if (this.themeService.getCurrentTheme() === Theme.Dark) {
      return 'dark-theme-box';
    }
    return '';
  }

  private getValueToSort(data, header): string | number {
    if (header === 'dashboardName') {
      header = 'name';
    }
    return data[header] ? data[header] : '';
  }
}
