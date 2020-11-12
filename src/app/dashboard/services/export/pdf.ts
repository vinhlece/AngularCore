import 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import {Exporter} from '../index';
import {toJSON} from './toJSON';

export class PDFExporter implements Exporter {
  exportData(data: any, fileName: string) {
    const jsonData = toJSON(data);
    const doc = new jsPDF('p', 'pt');
    const columns = this.getFields(jsonData).map((field: string) => ({
      title: field,
      dataKey: field
    }));
    const options = {
      styles: {
        fontSize: 5,
      }
    };
    doc.autoTable(columns, jsonData, options);
    doc.save(fileName);
  }

  private getFields(jsonData: any): string[] {
    if (jsonData.length === 0) {
      return [];
    }
    return Object.keys(jsonData[0]);
  }
}
