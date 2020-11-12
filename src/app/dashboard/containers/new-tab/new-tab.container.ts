import {Component, EventEmitter, Input, Output} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {isNullOrUndefined} from 'util';
import {NewDialogWithTitleComponent} from '../../components/common/new-dialog-with-title.component';
import {Tab} from '../../models';

@Component({
  selector: 'app-new-tab-button',
  template: `
    <button mat-button mat-fab matTooltip="Add new tab" color="primary" (click)="openCreateNewTabDialog()">
      <mat-icon>add</mat-icon>
    </button>
  `
})
export class NewTabContainer {
  private tab: Tab;
  private dialogService: MatDialog;

  @Input() dashboardId: string;
  @Output() onNewTab: EventEmitter<Tab>;

  constructor(dialogService: MatDialog) {
    this.dialogService = dialogService;
    this.onNewTab = new EventEmitter();
  }

  get DialogService() {
    return this.dialogService;
  }

  openCreateNewTabDialog() {
    const dialogRef = this.dialogService.open(NewDialogWithTitleComponent, {
      width: '600px',
      data: {
        title: 'New Tab',
        inputData: {name: null}
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === '' || isNullOrUndefined(result)) {
        return false;
      }
      this.tab = result;
      this.tab.dashboardId = this.dashboardId;
      this.onNewTab.emit(this.tab);
    });
  }
}
