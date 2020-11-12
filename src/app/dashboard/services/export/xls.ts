import {GridApi} from 'ag-grid-community';
import * as XLSX from 'xlsx';
import {Exporter} from '../index';
import {toJSON} from './toJSON';

export class XLSExporter implements Exporter {
  exportData(data: any, fileName: string) {
    const jsonData = toJSON(data);
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }
}

export class AgGridXLSExporter implements Exporter {
  private _api: GridApi;

  constructor(api: GridApi) {
    this._api = api;
  }

  exportData(data: any[], fileName: string) {
    this._api.exportDataAsExcel();
  }
}
