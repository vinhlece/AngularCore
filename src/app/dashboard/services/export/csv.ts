import {GridApi} from 'ag-grid-community';
import * as XLSX from 'xlsx';
import {Exporter} from '../index';
import {toJSON} from './toJSON';

export class CSVExporter implements Exporter {
  exportData(data: any[], fileName: string) {
    const jsonData = toJSON(data);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // write workbook to csv;
    XLSX.writeFile(wb, fileName);
  }
}

export class AgGridCSVExporter implements Exporter {
  private _api: GridApi;

  constructor(api: GridApi) {
    this._api = api;
  }

  exportData(data: any[], fileName: string) {
    this._api.exportDataAsCsv();
  }
}
