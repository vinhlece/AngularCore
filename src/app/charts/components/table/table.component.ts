import {
  Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output,
  ViewEncapsulation
} from '@angular/core';
import {ColumnController, GridApi, GridOptions, RowNode} from 'ag-grid-community';
import 'ag-grid-enterprise';
import {AppDateTimeFormat} from '../../../common/models/enums';
import {
  getCurrentMoment,
  getMomentByTimestamp
} from '../../../common/services/timeUtils';
import {Column, Paging, TabularWidget, Widget} from '../../../widgets/models';
import {DataDisplayType, GroupOptions} from '../../../widgets/models/enums';
import {ChartReadyEvent, Dimension, MoveColumnEvent, TabularCellValue, WidgetMouseEvent} from '../../models';
import {GroupCellRendererComponent} from '../group-cell-renderer/group-cell-renderer.component';
import {HeaderRendererComponent} from '../header-renderer/header-renderer.component';
import {TableCellRendererComponent} from '../table-cell-renderer/table-cell-renderer.component';
import {GroupParams, TimeRangeInterval} from '../../../dashboard/models/index';
import {Key, MeasureTimestamp} from '../../../widgets/models/constants';
import {Agent, DimensionInstances, Queue, Region} from '../../../common/models/constants';
import {appConfig} from '../../../config/app.config';
import {TranslateService} from '@ngx-translate/core';
import {isNullOrUndefined} from '../../../common/utils/function';
import {ThemeService} from '../../../theme/theme.service';
import {static_data} from '../../../dashboard/models/constants';

@Component({
  selector: 'app-table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit, OnChanges {
  private _el: ElementRef;
  private _expandedLeafGroups = 0;
  private _onColumnMovedParams: any = null;
  private _widget: TabularWidget;
  private _timeRange: { from: number, to: number };

  agGridApi: GridApi;
  columnsDefs: any;
  columnWidth: any;
  currentPageSize = 100;
  rowClassRules;
  pageSizeOptions = [5, 10, 25, 50, 100];
  gridOptions: GridOptions;
  rowData: any;
  localeText: any = null;
  isLoadStaticData: boolean = false;
  widgetDataStatic: any;
  widgetColumns: any;

  @Input() data: any;
  @Input() size: Dimension;
  @Input() interval: TimeRangeInterval;
  @Input() isOverlayWidget: boolean;

  @Input()
  get widget(): TabularWidget {
    return this._widget;
  }

  set widget(widget: TabularWidget) {
    if (widget) {
      this._widget = widget;
      this.widgetDataStatic = this.widgetDataStatic ? this.widgetDataStatic : static_data.find(data => data.type === this.widget.type);
      this.widgetColumns = !this.isLoadStaticData ? this.widgetDataStatic.columns : this.widget.columns;
      this.columnWidth = this.getColumnWidth();
      if (this.gridOptions) {
        this.gridOptions.autoGroupColumnDef = this.getAutoGroupColumnDef();
        this.gridOptions.frameworkComponents = this.getFrameworkComponents();
      }
    }
  }

  @Output() onChartReady = new EventEmitter<ChartReadyEvent>();
  @Output() onContextMenu = new EventEmitter<WidgetMouseEvent>();
  @Output() onMouseDown = new EventEmitter<WidgetMouseEvent>();
  @Output() onMoveColumn = new EventEmitter<MoveColumnEvent>();
  @Output() onColumnMouseDown = new EventEmitter<WidgetMouseEvent>();
  @Output() onPage = new EventEmitter<Paging>();
  @Output() onAutoInvokeUrls = new EventEmitter<any>();
  @Output() onDoubleClick = new EventEmitter<void>();
  @Output() onColumnResize = new EventEmitter<Widget>();

  constructor(el: ElementRef, public translate: TranslateService, themeService: ThemeService) {
    this._el = el;
    this.updateLanguage();
  }

  @HostListener('window:visibilitychange', ['$event'])
  onVisibilityChange() {
    this.ngOnChanges();
  }

  ngOnInit() {
    this.currentPageSize = this.widget.paging && this.widget.paging.size ? this.widget.paging.size : 5;
    this.getGridOptions();
  }

  ngOnChanges() {
    if (this.agGridApi && this.data && !window.document.hidden) {
      this.updateData();
    }
  }

  handlePageSizeChange() {
    this.agGridApi.paginationSetPageSize(this.currentPageSize);
    this.onPage.emit({size: this.currentPageSize, index: this.agGridApi.paginationGetCurrentPage()});
  }

  handleContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  updateLanguage() {
    this.localeText = this.translate.instant('charts.tabular.ag_grid');
    this.translate.onLangChange.subscribe((data) => this.localeText = data.translations.charts.tabular.ag_grid);
  }

  private updateColumnDefs() {
    this.columnsDefs = this.widgetColumns.map((column: Column) => {
      return {
        aggFunc: column.aggFunc,
        cellRenderer: 'cellRenderer',
        cellStyle: this.getCellStyle(column),
        filter: this.getFilter(column),
        filterParams: this.getFilterParams(column),
        field: column.id,
        rowGroup: column.group ? column.group.enable : false,
        rowGroupIndex: (column.group && column.group.enable) ? column.group.priority : null,
        headerName: this.getColumnTitle(column),
        headerComponentFramework: HeaderRendererComponent,
        headerComponentParams: this.getHeaderComponentParams(column),
        hide: !column.visibility || (column.group ? column.group.enable : false),
        width: column.width ? column.width : this.columnWidth,
        suppressSizeToFit: !isNullOrUndefined(column.width),
        cellRendererParams: () => this.getCellRendererParams(column),
        keyCreator: (params) => this.keyCreator(column, params),
        valueGetter: (params) => this.valueGetter(column, params)
      };
    });
    console.log(this.columnsDefs);
  }

  handleChangeTimeRange(event) {
    this._timeRange = event;
    if (this.agGridApi && this.data) {
      this.updateData();
    }
  }

  formatValue(cell: TabularCellValue): string {
    if (cell.format === 'datetime') {
      return getMomentByTimestamp(cell.value).format(AppDateTimeFormat.dateTime);
    } else if (cell.format === 'time') {
      return getMomentByTimestamp(+cell.value * 1000).format(AppDateTimeFormat.time);
    }
    const value = cell.value.toString();
    if (cell.format === 'number') {
      return parseFloat(value).toLocaleString('en');
    }
    return value;
  }

  getInRangeData() {
    const dataSource = this.data && this.data.data.length > 0 ? this.data.data : [];
    let tempData;
    if (dataSource.length > 0) {
      tempData = this._timeRange ? dataSource.filter(record => this.isInTimeRange(record)) : dataSource;
      if (this.isLoadStaticData || this.widgetColumns.length !== this.widget.columns.length) {
        this.widgetColumns = this.widget.columns;
        this.updateColumnDefs();
        this.isLoadStaticData = false;
      }
    } else {
      tempData = this.widgetDataStatic['data']['data'];
      if (!this.isLoadStaticData) {
        this.widgetColumns = this.widgetDataStatic.columns;
        this.updateColumnDefs();
        this.isLoadStaticData = true;
      }
    }
    tempData.forEach((tData, index) => {
      this.columnsDefs.forEach((tColumn, indexC) => {
        if (tData[tColumn.field]) {
          if (tData[tColumn.field].secondary) {
            tData[tColumn.field].primary.value = this.formatValue(tData[tColumn.field].primary) + ' (' + this.formatValue(tData[tColumn.field].secondary) + ')';
          } else if (tData[tColumn.field].primary) {
            tData[tColumn.field].primary.value = this.formatValue(tData[tColumn.field].primary);
          }
        }
      });
    });
    this.rowData = tempData;
  }

  private updateData() {
    const t1 = appConfig.performanceLogging ? performance.now() : null;
    // this.setScrolling(false);
    this.getInRangeData();
    this.agGridApi.setRowData(this.rowData);
     this.agGridApi.refreshCells({force: true});
    // this.agGridApi.redrawRows();
    if (this.data && this.data.autoInvokeUrls) {
      this.onAutoInvokeUrls.emit(this.data.autoInvokeUrls);
    }

    if (appConfig.performanceLogging) {
      console.log(`Render time: (${this.widget.name}-${this.widget.type}): ${Math.floor(performance.now() - t1)}ms`);
    }
  }

  private isInTimeRange(record): boolean {
    const recordTimeRange = record.MeasureTimestamp.primary.value;
    const rs = recordTimeRange > this._timeRange.from && recordTimeRange < this._timeRange.to;
    return rs;
  }

  private getColumnWidth() {
    return this.size ? this.size.width / (this.widgetColumns.length) : null;
  }

  private getGridOptions() {
    this.gridOptions = <GridOptions> {
      autoGroupColumnDef: this.getAutoGroupColumnDef(),
      animateRows: true,
      enableSorting: true,
      enableFilter: true,
      enableColResize: true,
      deltaRowDataMode: this.widget.displayData === DataDisplayType.EndOfTimeline,
      // frameworkComponents: this.getFrameworkComponents(),
      pagination: true,
      paginationPageSize: this.currentPageSize,
      rememberGroupStateWhenNewData: true,
      suppressAggFuncInHeader: true,
      suppressLoadingOverlay: true,
      suppressNoRowsOverlay: true,
      suppressContextMenu: true,
      suppressDragLeaveHidesColumns: true,
      headerHeight: 40,
      rowHeight: 35,
      getRowNodeId: (row) => this.getRowNodeId(row),
      onGridReady: (params) => this.onGridReady(params),
      onCellMouseDown: (params) => this.onCellMouseDown(params),
      onCellDoubleClicked: (params) => this.onCellDoubleClicked(params),
      onCellContextMenu: (params) => this.onCellContextMenu(params),
      onColumnMoved: (params) => this.onColumnMoved(params),
      onDragStopped: (params) => this.onDragStopped(params),
      onRowGroupOpened: (params) => this.onRowGroupOpened(params),
      onExpandOrCollapseAll: (params) => this.onExpandOrCollapseAll(params),
      onGridSizeChanged: (params) => this.setSizeColumnToFit(params),
      onDisplayedColumnsChanged: (params) => this.setSizeColumnToFit(params),
      onBodyScroll: (params) => this.setScrolling(true),
      onColumnResized: (params) => this.setColumnWidth(params)
    };
    this.getRowClassRules();
  }

  private getRowClassRules() {
    const that = this;
    this.rowClassRules = {
      'manualExpand': function(params) {
        return that.isLeafGroupNode(params.node) && (that._widget.hideIcon);
      }
    };
  }

  private getAutoGroupColumnDef() {
    return {
      cellStyle: this.getCellStyle(),
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: 'groupCellRenderer',
        suppressCount: true
      },
      lockPosition: true,
    };
  }

  private getCellStyle(column = null) {
    let fontWeight = null;
    let fontSize = 16;
    if (column) {
      fontWeight = column.type === 'string' ? '900' : '500';
      if (column.type === 'number') {
        fontSize = fontSize + 2;
      }
    }
    console.log(column);

    return this.widget.font
      ? {
        padding: 0,
        color: column && column.value && this.isHaveSecondaryVal(column.value) ? 'green' : 'contrast',
        fontFamily: this.widget.font.fontFamily ? `${this.widget.font.fontFamily}` : 'Poppins',
        fontSize: this.widget.font.fontSize ? `${this.widget.font.fontSize}px` : `${fontSize}px`,
        fontWeight: this.widget.font.fontWeight ? `${this.widget.font.fontWeight}` : fontWeight,
        textOutline: '1px contrast',
      }
      : {
        padding: 0,
        color: column && column.value && this.isHaveSecondaryVal(column.value) ? 'green' : '',
        fontFamily: 'Poppins',
        fontSize: `${fontSize}px`,
        fontWeight
      };
  }

  isHaveSecondaryVal(val: string) {
    for (let i = 0; i < val.length; i++) {
      if (val[i] === '(') {
        return true;
      }
    }
    return false;
  }

  private getColumnTitle(column: Column): string {
    if (isNullOrUndefined(column.aggFunc)) {
      return column.title && column.title.trim().length > 0 ? column.title : column.id;
    } else {
      return column.title !== column.id && column.title.trim().length > 0 ? column.title : `${column.aggFunc}(${column.id})`;
    }
  }

  private getCompareValue(cellData) {
    return cellData && cellData.primary ? cellData.primary.value : null;
  }

  private getFrameworkComponents() {
    return {
      cellRenderer: TableCellRendererComponent,
      groupCellRenderer: GroupCellRendererComponent
    };
  }

  private getCellRendererParams(column) {
    return {
      widgetColumns: column
    };
  }

  private getFilterData(value) {
    if (value.primary.format === 'datetime') {
      return value.primary.value ? getMomentByTimestamp(value.primary.value).format(AppDateTimeFormat.dateTime).toLowerCase() : '';
    } else if (value.format === 'time') {
      return value.primary.value ? getMomentByTimestamp(value.primary.value).format(AppDateTimeFormat.time).toLowerCase() : '';
    }
    return `${value.primary ? value.primary.value : ''}${value.secondary ? '(' + value.secondary.value + ')' : ''}`.toLowerCase();
  }

  private getFilter(column: Column) {
    switch (column.type) {
      case 'number':
        return 'agNumberColumnFilter';
      case 'datetime':
        return 'agDateColumnFilter';
      default:
        return 'agTextColumnFilter';
    }
  }

  private getFilterParams(column: Column) {
    return {
      valueGetter: (node: RowNode) => {
        const nodeValue = node.data[column.id];
        switch (column.type) {
          case 'number':
            return nodeValue ? nodeValue.primary.value : null;
          case 'datetime':
            return nodeValue ? getMomentByTimestamp(nodeValue.primary.value).format(AppDateTimeFormat.dateTime).toLowerCase() : null;
          default:
            return nodeValue;
        }
      },
      textFormatter: (value) => {
        return value;
      },
      textCustomComparator: (filter: string, value: any, filterText: string): boolean => {
        return this.filterData(filter, value, filterText);
      }
    };
  }

  private getRowNodeId(row) {
    return row.Id;
  }

  private getMouseEvent(params): WidgetMouseEvent {
    let targetCol = params.colDef.field;
    let keyCol = null;
    if (params.data) {
      keyCol = params.data.Key.primary.value;
    } else if (params.node.group) {
      const groupParams = this.getGroupParams(targetCol, params.node);
      if (params.node.level === 2 && groupParams) {
        keyCol = groupParams.instance[0];
      } else if (params.node.level === 1 && groupParams) {
        const splitInstace = groupParams.instance[0].split(',')
        keyCol = splitInstace[0] + ',' + splitInstace[1];
      } else {
        keyCol = params.node.field !== 'MeasureTimestamp' ? params.node.key : null;
      }
      targetCol = isNullOrUndefined(targetCol) ? params.node.field : targetCol;
    }

    const event = <MouseEvent>params.event;
    event['widget'] = this.widget;
    event['cell'] = {
      keyCol: keyCol,
      targetCol: targetCol
    };
    event['otherParams'] = this.getOtherParams(params.data);
    event['groupParams'] = this.getGroupParams(targetCol, params.node);
    return event;
  }

  private getHeaderComponentParams(column) {
    return {
      newColumn: column,
      widget: this.widget,
      onMouseDown: this.onColumnMouseDown
    };
  }

  private onGridReady(params) {
    this.agGridApi = params.api;
    this.updateData();
    params.api.sizeColumnsToFit();
    this.onChartReady.emit({api: this.agGridApi});
  }

  private onCellMouseDown(params) {
    const mouseEvent = this.getMouseEvent(params);
    if (mouseEvent.cell.keyCol || mouseEvent.cell.targetCol) {
      this.onMouseDown.emit(mouseEvent);
    }
  }


  private onCellDoubleClicked(params) {
    const mouseEvent = this.getMouseEvent(params);
    if (mouseEvent.cell.keyCol) {
      this.onDoubleClick.emit();
    }
  }

  private onCellContextMenu(params) {
    const mouseEvent = this.getMouseEvent(params);
    if (mouseEvent.cell.keyCol) {
      this.onContextMenu.emit(this.getMouseEvent(params));
    }
  }

  private onColumnMoved(params) {
    this._onColumnMovedParams = params;
  }

  private onDragStopped(params) {
    if (this._onColumnMovedParams) {
      this.orderColumns(this._onColumnMovedParams);
      this._onColumnMovedParams = null;
    }
  }

  private filterData(filter: string, value: any, filterText: string): boolean {
    const filterTextLoweCase = filterText.toLowerCase();
    const valueLowerCase = this.getFilterData(value);
    switch (filter) {
      case 'contains':
        return valueLowerCase.indexOf(filterTextLoweCase) >= 0;
      case 'notContains':
        return valueLowerCase.indexOf(filterTextLoweCase) === -1;
      case 'equals':
        return valueLowerCase === filterTextLoweCase;
      case 'notEqual':
        return valueLowerCase !== filterTextLoweCase;
      case 'startsWith':
        return valueLowerCase.indexOf(filterTextLoweCase) === 0;
      case 'endsWith':
        const index = valueLowerCase.lastIndexOf(filterTextLoweCase);
        return index >= 0 && index === (valueLowerCase.length - filterTextLoweCase.length);
      default:
        // should never happen
        console.warn('invalid filter type ' + filter);
        return false;
    }
  }

  private orderColumns(params) {
    const gridColumns = params.columnApi.columnController.gridColumns;
    const columns = gridColumns.reduce((acc, displayedColumn) => {
      const column = this.widgetColumns.find((item: Column) => displayedColumn.colId.includes(item.id));
      if (column) {
        acc.push(column);
      }
      return acc;
    }, []);
    this.onMoveColumn.emit({columns});
  }

  private setColumnWidth(param) {
    if (param && param.finished && param.source === 'uiColumnDragged') {
      this.widgetColumns.forEach((column: Column) => {
        if (column.id === param.column.colId) {
          column.width = param.column.actualWidth;
        }
      });
      this.onColumnResize.emit(this.widget);
    }
  }

  private keyCreator(column: Column, params) {
    if (column.type === 'datetime') {
      switch (column.groupBy) {
        case GroupOptions.Month:
          return getMomentByTimestamp(params.value).startOf('month').format(AppDateTimeFormat.date);
        case GroupOptions.Week:
          return getMomentByTimestamp(params.value).startOf('week').format(AppDateTimeFormat.date);
        case GroupOptions.Hour:
          return this.getTimeGroup(column, params.value);
        default:
          return getMomentByTimestamp(params.value).startOf('day').format(AppDateTimeFormat.date);
      }
    }
    return params.value;
  }

  private valueGetter(column: Column, params) {
    if (!params.data) {
      return null;
    }

    const data = this.getCompareValue(params.data[params.colDef.field]);

    if (column.type === 'datetime' && column.groupBy === GroupOptions.Hour) {
      return this.getTimeGroup(column, data);
    }
    return data;
  }

  private onRowGroupOpened(params) {
    const node = params.node;
    if (this.isLeafGroupNode(node)) {
      if (node.expanded) {
        this.addExpandedLeafGroup(node);
      } else {
        this.removeExpandedLeafGroup(node);
      }
      this.setRowGroupColumnVisibility(params.columnApi);
    } else {
      if (!node.expanded) {
        this.collapseChildGroups(node);
      }
    }
    this.agGridApi.redrawRows();
  }

  private onExpandOrCollapseAll(params) {
    this._expandedLeafGroups = 0;
    if (params.source === 'expandAll') {
      this.agGridApi.forEachNode((node: RowNode) => {
        this.addExpandedLeafGroup(node);
      });
    }
    this.setRowGroupColumnVisibility(params.columnApi);
  }

  private collapseChildGroups(node: RowNode) {
    node.childrenAfterGroup.forEach((childNode: RowNode) => {
      if (this.isGroupNode(childNode)) {
        childNode.setExpanded(false);
        this.removeExpandedLeafGroup(node);
        this.collapseChildGroups(childNode);
      }
    });
  }

  private addExpandedLeafGroup(node: RowNode) {
    if (node.leafGroup) {
      this._expandedLeafGroups++;
    }
  }

  private removeExpandedLeafGroup(node: RowNode) {
    if (node.leafGroup) {
      this._expandedLeafGroups--;
    }
  }

  private setRowGroupColumnVisibility(columnApi: ColumnController) {
    const isVisible = (this._expandedLeafGroups > 0);
    columnApi.getRowGroupColumns().forEach((col) => {
      const column = this.widgetColumns.find(item => col.getColId().includes(item.id));
      columnApi.setColumnVisible(col.getColId(), column.visibility && isVisible);
    });
  }

  private isGroupNode(node: RowNode): boolean {
    return node.group;
  }

  private isLeafGroupNode(node: RowNode): boolean {
    return node.leafGroup;
  }

  private setSizeColumnToFit(params) {
    if (params.type === 'gridSizeChanged' && params.clientWidth === 0 && params.clientHeight === 0) {
      return;
    }
    params.api.sizeColumnsToFit();
  }

  private setScrolling(isScrolling: boolean) {
    this.agGridApi['isFlashing'] = !isScrolling && this.widget.flashing;
  }

  private getOtherParams(data: any): object {
    if (!data) {
      return {};
    }
    const otherParams = Object.keys(data)
      .filter(function (key) {
        return key !== 'AutoInvokeUrls' && key !== 'Key' && key !== 'Id';
      })
      .reduce(function (acc, key) {
        const property = key.toLowerCase() === 'measuretimestamp' ? 'timestamp' : key.toLowerCase();
        acc[property] = data[key].primary.value;
        return acc;
      }, {});
    return otherParams;
  }

  private getGroupParams(targetCol: string, data: any): GroupParams {
    if (!data || !data.allLeafChildren) {
      return null;
    }
    const level = data.level;
    const instances = [];
    const timestamps = [];
    let measures = [];
    const exception = [Key, MeasureTimestamp, Agent, Queue, Region];

    data.allLeafChildren.forEach(row => {
      const instance = row.data[Key].primary.value;
      const timestamp = row.data[MeasureTimestamp].primary.value;
      instances.push(instance);
      timestamps.push(timestamp);
    });

    if (exception.findIndex(item => item === targetCol) < 0) {
      measures = [targetCol];
    } else {
      measures = data.columnController.columnDefs.filter(col => (
        exception.findIndex(item => item === col.field) < 0)).map(col => col.field);
    }

    const isDimension = (key: string) => DimensionInstances.findIndex(item => item === key) >= 0;
    const dimensionInstances = [data.key];
    let isDimensionGroup = false;
    if (isDimension(data.field)) {
      isDimensionGroup = true;
      let parent = data.parent;
      while (parent && parent.level >= 0) {
        if (isDimension(parent.field)) {
          dimensionInstances.push(parent.key);
        }
        parent = parent.parent;
      }
    }
    const dimension = dimensionInstances.reverse().join(',');
    return {
      group: dimension,
      instance: isDimensionGroup ? [dimension] : instances.filter(this.onlyUnique),
      measure: measures,
      timestamps: timestamps.filter(this.onlyUnique)
    };
  }

  private onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  private getTimeGroup(column: Column, nodeValue): string {
    if (!isNaN(nodeValue)) {
      const moment = getMomentByTimestamp(nodeValue);
      const timeGroup: number = Math.floor(moment.hour() / column.groupRange);
      const startTime = this.setMoment(column.groupRange * timeGroup).format(AppDateTimeFormat.hour);
      const nodeDay = moment.format(AppDateTimeFormat.date);
      return `${nodeDay}, ${startTime}`;
    }
    return nodeValue;
  }

  private setMoment(hour) {
    return getCurrentMoment().set({
      hour,
      minute: 0,
      second: 0,
      millisecond: 0
    });
  }
}
