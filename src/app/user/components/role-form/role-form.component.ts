import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {Role} from '../../../common/models/index';
import {ContextMenuEvent} from '../../../layout/components/context-menu/context-menu.component';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['index', 'role'];
  dataSource: MatTableDataSource<Role> = new MatTableDataSource([]);
  selectedRow: any;
  contextMenuEvents: ContextMenuEvent;
  @Input() roles: Role[];
  @Output() deleteRoleEventEmitter: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(MatSort) private sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource.data = this.roles;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data, header) => this.getValueToSort(data, header);
  }

  ngOnChanges() {
    if (!isNullOrUndefined(this.dataSource)) {
      this.dataSource.data = this.roles;
    }
  }

  handleShowContextMenu(event, row) {
    event.preventDefault();
    this.selectedRow = row;
    this.contextMenuEvents = {
      type: event.type,
      target: event.target as HTMLElement,
      clientX: event.clientX,
      clientY: event.clientY
    };
  }

  handleDeleteRole() {
    if (isNullOrUndefined(this.selectedRow)) {
      return;
    }
    this.deleteRoleEventEmitter.emit(this.selectedRow.id);
    this.selectedRow = null;
  }

  private getValueToSort(data, header): string | number {
    if (header === '') {
      header = 'name';
    }
    return data[header] ? data[header] : '';
  }
}
