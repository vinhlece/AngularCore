import {Component, ElementRef, ViewChild} from '@angular/core';
import {IHeaderAngularComp} from 'ag-grid-angular';
import {HeaderParams} from '../../models';
import {Agent, Queue, Region} from '../../../common/models/constants';

@Component({
  selector: 'app-header-renderer',
  templateUrl: './header-renderer.component.html',
  styleUrls: ['./header-renderer.component.scss']
})
export class HeaderRendererComponent implements IHeaderAngularComp {
  params: HeaderParams;
  sorted: string;
  defaultFont = {
    fontWeight: '500',
    fontFamily: 'Poppins',
    fontSize: '17px',
  };

  @ViewChild('openMenu') openMenu: ElementRef;

  agInit(params: HeaderParams) {
    this.params = params;
    this.params.column.addEventListener('sortChanged', () => this.handleSortChanged());
    this.handleSortChanged();
  }

  handleSort(event: MouseEvent) {
    let order;
    if (this.sorted === '') {
      order = 'asc';
    } else if (this.sorted === 'asc') {
      order = 'desc';
    } else {
      order = '';
    }
    this.params.setSort(order, event.shiftKey);
  }

  handleSortChanged() {
    if (this.params.column.isSortAscending()) {
      this.sorted = 'asc';
    } else if (this.params.column.isSortDescending()) {
      this.sorted = 'desc';
    } else {
      this.sorted = '';
    }
  }

  handleOpenMenu(event: MouseEvent) {
    event.stopPropagation();
    this.params.showColumnMenu(this.openMenu.nativeElement);
  }

  handleMouseDown(event: MouseEvent) {
    event['widget'] = this.params.widget;
    event['column'] = this.params.column.getColDef().field;
    this.params.onMouseDown.emit(event);
  }

  getHeaderStyle(): any {
    const numberType = this.params.newColumn.type === 'number';
    const font = this.params.widget.font;
    const dimensionInstance = this.checkDimensionInstance(this.params.newColumn)
    const fontWeight = numberType || dimensionInstance ? '900' : this.defaultFont.fontWeight;
    const groupHeader: HTMLElement = (<HTMLElement>document.getElementsByClassName('ag-header-cell-text')[0]);
    if (font) {
      if (groupHeader) {
        groupHeader.style.fontSize = font.fontSize ? `${font.fontSize}px` : this.defaultFont.fontSize;
        groupHeader.style.fontWeight = font.fontWeight ? font.fontWeight : 'bold';
        groupHeader.style.fontFamily = font.fontFamily ? font.fontFamily : this.defaultFont.fontFamily;
      }
      return {
        fontSize: font.fontSize ? `${font.fontSize}px` : this.defaultFont.fontSize,
        fontWeight: fontWeight,
        fontFamily: font.fontFamily ? `${font.fontFamily}` : this.defaultFont.fontFamily,
      };
    } else {
      if (groupHeader) {
        groupHeader.style.fontSize = this.defaultFont.fontSize;
        groupHeader.style.fontWeight = 'bold';
        groupHeader.style.fontFamily = this.defaultFont.fontFamily;
      }
      return {
        ...this.defaultFont,
        fontWeight
      };
    }
  }

  checkDimensionInstance(column) {
    const dimensionInstances = [Agent, Queue, Region];
    return dimensionInstances.findIndex(instance => instance === column.id) >= 0;
  }
}
