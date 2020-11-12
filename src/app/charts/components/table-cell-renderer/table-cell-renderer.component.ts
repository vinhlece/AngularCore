import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {isNullOrUndefined} from 'util';
import {AppDateTimeFormat} from '../../../common/models/enums';
import {getMomentByTimestamp} from '../../../common/services/timeUtils';
import {WidgetFont} from '../../../widgets/models';
import {TabularCellValue} from '../../models';

@Component({
  selector: 'app-table-cell-renderer',
  templateUrl: './table-cell-renderer.component.html',
  styleUrls: ['./table-cell-renderer.component.scss']
})
export class TableCellRendererComponent implements ICellRendererAngularComp {
  private _params: any;
  primary: any = null;
  secondary: any = null;
  columns: any = null;
  isFlashing: boolean = false;

  // called on init
  agInit(params: any): void {
    this._params = params;
    this.setData();
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this._params = params;
    this.setData();
    return true;
  }

  private setData() {
    const defaultValue = { value: 0 };
    this.isFlashing = this._params.api.isFlashing;
    if (this._params.data) {
      this.primary = this._params.data[this._params.colDef.field] ?
        this._params.data[this._params.colDef.field].primary : defaultValue;
      this.secondary = this._params.data[this._params.colDef.field] ?
        this._params.data[this._params.colDef.field].secondary : null;
    } else if (this._params.widgetColumns && this._params.widgetColumns.type === 'number') {
      if (!isNullOrUndefined(this._params.value)) {
        let value = this._params.value && typeof this._params.value === 'object' ?
          this._params.value.value : this._params.value;
        if (!value) {
          value = defaultValue.value;
        }
        const format = this._params.colDef.field === 'MeasureTimestamp' ?
          'datetime' : typeof value;
        let color = 'inherit';
        if (this._params.widgetColumns) {
          this.columns = this._params.widgetColumns;
        }
        if (this._params.node.leafGroup && this.columns) {
          const currentColumn = this.columns;
          if (currentColumn && currentColumn.threshold) {
            const {breakpoints, colors} = currentColumn.threshold;
            const hasBreakpoints = breakpoints && !isNullOrUndefined(breakpoints[1]) && !isNullOrUndefined(breakpoints[2]);
            const hasColors = colors && !isNullOrUndefined(colors[0]) && !isNullOrUndefined(colors[1]) && !isNullOrUndefined(colors[2]);

            if (hasBreakpoints && hasColors) {
              if (value < breakpoints[1]) {
                color = colors[0].value ? colors[0].value : 'inherit';
              } else if (value >= breakpoints[2]) {
                color = colors[2].value ? colors[2].value : 'inherit';
              } else {
                color = colors[1].value  ? colors[1].value : 'inherit';
              }
            }
          }
        }
        value = format === 'number' ? Math.round(value * 100) / 100 : value;
        this.primary = {
          value,
          color,
          format
        };
      }
    }
  }

  formatValue(cell: TabularCellValue): string {
    if (cell.format === 'datetime') {
      return cell.value ? getMomentByTimestamp(cell.value).format(AppDateTimeFormat.dateTime) : null;
    } else if (cell.format === 'time') {
      return cell.value ? getMomentByTimestamp(+cell.value * 1000).format(AppDateTimeFormat.time) : null;
    }
    return cell.value ? cell.value.toString() : null;
  }
}
