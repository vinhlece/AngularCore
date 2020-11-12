import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {Measure} from '../../models';
import {ContextMenuEvent} from '../../../layout/components/context-menu/context-menu.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-measures',
  templateUrl: './measures.component.html',
  styleUrls: ['./measures.component.scss']
})
export class MeasuresComponent implements OnInit, OnChanges {
  private _contextMeasure: Measure;

  dataSource: MatTableDataSource<Measure> = new MatTableDataSource([]);
  displayedColumns: string[] = ['name', 'dataType', 'status'];
  contextMenuEvent: ContextMenuEvent;

  @Input() measures: Measure[];
  @Input() errorMessage: string;

  @Output() onEdit = new EventEmitter<Measure>();
  @Output() onDelete = new EventEmitter<string>();

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.measures;
  }

  ngOnChanges() {
    this.dataSource.data = this.measures;
}

  handleContextMenu(event: MouseEvent, measure: Measure) {
    event.preventDefault();
    this._contextMeasure = measure;
    this.contextMenuEvent = {
      type: event.type,
      target: event.target as HTMLElement,
      clientX: event.clientX,
      clientY: event.clientY
    };
  }

  clickOnRow(measure: Measure) {
    this.onEdit.emit(measure);
  }

  editMeausre() {
    this.onEdit.emit(this._contextMeasure);
  }

  deleteMeausre() {
    this.onDelete.emit(this._contextMeasure.name);
  }

  applyFilter(value) {
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
