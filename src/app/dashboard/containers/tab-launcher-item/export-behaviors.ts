import {Widget} from '../../../widgets/models';
import {ExportType} from '../../models/enums';
import {Exporter} from '../../services';
import {AgGridCSVExporter, CSVExporter} from '../../services/export/csv';
import {PDFExporter} from '../../services/export/pdf';
import {AgGridXLSExporter, XLSExporter} from '../../services/export/xls';

export interface ExportBehavior {
  exportData(exportType: string, data: any, api);
}

export class DoNotExport implements ExportBehavior {
  exportData(exportType: string, data: any, api) {
    // Do nothing
  }
}

export abstract class CanExport implements ExportBehavior {
  private _widget: Widget;

  constructor(widget: Widget) {
    this._widget = widget;
  }

  abstract csvExporter(api): Exporter;

  abstract pdfExporter(api): Exporter;

  abstract xlsExporter(api): Exporter;

  exportData(type: string, data: any, api) {
    const fileName = `${this._widget.name}.${type}`;

    let exporter: Exporter;
    switch (type) {
      case ExportType.CSV:
        exporter = this.csvExporter(api);
        break;
      case ExportType.PDF:
        exporter = this.pdfExporter(api);
        break;
      case ExportType.XLS:
        exporter = this.xlsExporter(api);
        break;
      default:
        exporter = null;
    }
    exporter.exportData(data, fileName);
  }
}

export class MatTableExport extends CanExport {
  constructor(widget: Widget) {
    super(widget);
  }

  csvExporter(api): Exporter {
    return new CSVExporter();
  }

  pdfExporter(api): Exporter {
    return new PDFExporter();
  }

  xlsExporter(api): Exporter {
    return new XLSExporter();
  }
}

export class AgGridExport extends CanExport {
  constructor(widget: Widget) {
    super(widget);
  }

  csvExporter(api): Exporter {
    return new AgGridCSVExporter(api);
  }

  pdfExporter(api): Exporter {
    return new PDFExporter();
  }

  xlsExporter(api): Exporter {
    return new AgGridXLSExporter(api);
  }
}
