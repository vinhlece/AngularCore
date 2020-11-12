import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ContextMenuEvent} from '../../../layout/components/context-menu/context-menu.component';
import {Widget} from '../../models';
import {ThemeService} from '../../../theme/theme.service';

@Component({
  selector: 'app-widget-list',
  templateUrl: './widget-list.component.html',
  styleUrls: ['./widget-list.component.scss']
})
export class WidgetListComponent implements OnInit, OnChanges {
  private _contextWidget: Widget;

  @ViewChild(MatSort)
  private _sort: MatSort;
  private _themeService: ThemeService;

  @Input() widgets: Widget[];
  @Input() errorMessage: string;
  @Output() onLaunch = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<Widget>();
  @Output() onDelete = new EventEmitter<string>();

  displayedColumns = ['name', 'data-type', 'type', 'default-size'];
  dataSource: MatTableDataSource<Widget> = new MatTableDataSource([]);
  contextMenuEvent: ContextMenuEvent;

  constructor(themeService: ThemeService) {
    this._themeService = themeService;
  }

  ngOnInit() {
    this.dataSource.data = this.widgets;
    this.dataSource.sort = this._sort;
    this.dataSource.sortingDataAccessor = (data, header) => this.getValueToSort(data, header);
  }

  ngOnChanges() {
    this.updateDataSource();
  }

  handleContextMenu(event: MouseEvent, widget: Widget) {
    event.preventDefault();
    this._contextWidget = widget;
    this.contextMenuEvent = {
      type: event.type,
      target: event.target as HTMLElement,
      clientX: event.clientX,
      clientY: event.clientY
    };
  }

  launchWidget() {
    this.onLaunch.emit(this._contextWidget.id);
  }

  clickOnRow(widget) {
    this.onEdit.emit(widget);
  }

  editWidget() {
    this.onEdit.emit(this._contextWidget);
  }

  deleteWidget() {
    this.onDelete.emit(this._contextWidget.id);
  }

  private updateDataSource() {
    if (this.dataSource) {
      this.dataSource.data = this.widgets;
    }
  }

  private getValueToSort(data, header): string | number {
    switch (header) {
      case 'name':
        return data['name'] ? data['name'].toLowerCase() : '';
      case 'data-type':
        return data['dataType'] ? data['dataType'].toLowerCase() : '';
      case 'type':
        return data['type'] ? data['type'].toLowerCase() : '';
      default:
        return '';
    }
  }
}
