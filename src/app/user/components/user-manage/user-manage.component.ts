import {Component, OnInit, Output, EventEmitter, Input, ViewChild, OnChanges} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ContextMenuEvent} from '../../../layout/components/context-menu/context-menu.component';
import {User} from '../../models/user';
import {ThemeService} from '../../../theme/theme.service';
import {isNullOrUndefined} from '../../../common/utils/function';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.scss']
})
export class UserManageComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['index', 'userId', 'displayName'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource([]);
  selectedRow: any;
  contextMenuEvents: ContextMenuEvent;
  @Input() users: User[];
  @Output() deleteUserEventEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() editUserEventEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<User>();
  @ViewChild(MatSort) private sort: MatSort;

  constructor(themeSerVice: ThemeService) {}

  ngOnInit() {
    this.dataSource.data = this.users;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data, header) => this.getValueToSort(data, header);
  }
  ngOnChanges() {
    if (!isNullOrUndefined(this.dataSource)) {
      this.dataSource.data = this.users;
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

  clickOnRow(row) {
    this.onEdit.emit(row);
  }

  handleDeleteUser() {
    if (isNullOrUndefined(this.selectedRow)) {
      return;
    }
    this.deleteUserEventEmitter.emit(this.selectedRow.id);
    this.selectedRow = null;
  }

  handleEditUser() {
    if (isNullOrUndefined(this.selectedRow)) {
      return;
    }
    this.editUserEventEmitter.emit(this.selectedRow.id);
    this.selectedRow = null;
  }

  private getValueToSort(data, header): string | number {
    if (header === 'userName') {
      header = 'name';
    }
    return data[header] ? data[header] : '';
  }
}
