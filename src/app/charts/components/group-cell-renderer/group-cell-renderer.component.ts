import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-group-cell-renderer',
  templateUrl: './group-cell-renderer.component.html'
})
export class GroupCellRendererComponent implements ICellRendererAngularComp {
  value: string;

  // called on init
  agInit(params: any): void {
    this.value = params.value;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    return false;
  }
}
