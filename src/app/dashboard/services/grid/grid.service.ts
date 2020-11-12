import {ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {Subject} from 'rxjs';
import {DragEvent} from '../../../widgets/models';
import {GridMetrics, Placeholder} from '../../models';
import {GridItem} from './item';
import {isNullOrUndefined} from '../../../common/utils/function';

declare let $: any;

@Injectable()
export class GridService {
  private static readonly DEFAULT_VERTICAL_MARGIN = 20;

  private _componentFactoryResolver: ComponentFactoryResolver;
  private _rootViewContainer: ViewContainerRef;
  private _cellHeight;
  private _gridSize = {rows: 12, columns: 12};
  private _columns: number;
  private _rows: number;
  private _gridEl: Element;
  private _containerEl: Element;
  private _grid: any;
  private _metrics: GridMetrics;

  onDragStart = new Subject<DragEvent>();
  onDrag = new Subject<DragEvent>();
  onDragStop = new Subject<DragEvent>();
  onResizeStart = new Subject<Event>();
  onResizeStop = new Subject<Event>();
  onChange = new Subject<Placeholder[]>();
  onError = new Subject<string>();

  private static isLeftMouse(evt: MouseEvent) {
    return evt.button === 0;
  }

  private static removePreviousClones() {
    $('.widget-clone').remove();
  }

  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    this._componentFactoryResolver = componentFactoryResolver;
  }

  get metrics(): GridMetrics {
    return this._metrics;
  }

  makeGrid(rows: number, columns: number) {
    this._gridSize = {rows, columns};
    this._rows = rows;
    this._columns = columns;
    this._gridEl = document.querySelector('.grid-stack');
    this.calculateGridMetrics();
    this._cellHeight = this.metrics.innerRowHeight || 60;

    const gridOptions = {
      cellHeight: this._cellHeight,
      animate: false,
      width: this._columns,
      verticalMargin: 5,
      handle: '.grid-stack-item-content',
      // Widget from the outside with '.grid-stack-item' class will be added to grid
      acceptWidgets: '.grid-stack-item',
      draggable: {
        // Do not drag when line chart brush is being dragged
        // cancel: '.nv-brush'
        cancel: '.content-wrapper'
      },
      alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      resizable: { handles: 'e, se, s, sw, w' }
    };

    const $grid = $(this._gridEl);
    $grid.gridstack(gridOptions);
    this._grid = $grid.data('gridstack');
    this.setGridMinHeight();

    $grid.on('change', (event, items) => {
      items = items || [];
      const placeholders = items
        .filter(item => !isNullOrUndefined($(item.el).attr('data-id')))
        .map(item => this.gridItemAttributes($(item.el)));
      this.onChange.next(placeholders);
    });

    $grid.on('dragstart', (e, ui) => {
      this.onDragStart.next(this.getDragEvent(e, ui));
    });

    $grid.on('drag', (e, ui) => {
      this.onDrag.next(this.getDragEvent(e, ui));
    });

    $grid.on('dragstop', (e, ui) => {
      this.onDragStop.next(this.getDragEvent(e, ui));
    });

    $grid.on('resizestart', (e, ui) => {
      this.onResizeStart.next(e);
    });

    $grid.on('gsresizestop', (e, elem) => {
      this.onResizeStop.next(e);
    });
  }

  setRootViewContainer(viewContainerRef: ViewContainerRef) {
    this._rootViewContainer = viewContainerRef;
  }

  createDraggableWidget(placeholder: Placeholder, event: MouseEvent) {
    if (GridService.isLeftMouse(event)) {
      GridService.removePreviousClones();
      const $widget = this.createWidgetAt(placeholder, event.pageX, event.pageY);
      this.makeWidgetDraggable($widget, event);
    }
  }

  addWidget(placeholder: Placeholder, options?: { autoPosition: boolean }) {
    if (!this._grid) {
      return;
    }
    const {x, y} = placeholder.position;
    const {rows, columns} = placeholder.size;
    const autoPosition = options ? options.autoPosition : false;
    const $widget = this.createWidgetElement(placeholder);
    this._grid.addWidget($widget, x, y, columns, rows, autoPosition);
  }

  bulkAddWidget(placeholders: Placeholder[], options?: { autoPosition: boolean }) {
    if (this._grid) {
      this._grid.batchUpdate();
    }
    placeholders.forEach((placeholder: Placeholder) => this.addWidget(placeholder, options));
    if (this._grid) {
      this._grid.commit();
    }
  }

  removeWidget(placeholderId: string) {
    const el = $(this._gridEl).find(`[data-id='${placeholderId}']`);
    $(this._gridEl).data('gridstack').removeWidget(el);
  }

  update(): GridMetrics {
    if (!this._containerEl || !this._grid) {
      return;
    }

    this.calculateGridMetrics();
    this.setGridMinHeight();
    this._grid.cellHeight(this.metrics.innerRowHeight);
  }

  getGridItem(id: string): GridItem {
    const el = $(`.grid-stack-item[data-id=${id}]`);
    return new GridItem(el);
  }

  /**
   * |--|-------------------------------------------------------------- container     |
   * |--|-------------------------------------------------------------- grid line     | padding
   * |--|-------------------------------------------------------------- inner grid    |
   * |  |  |           |
   * |  |  |  ^     ^  |
   * |  |  |___________|
   * |  |
   * |  |
   * |  |
   * |  |
   * |  |
   * |  |
   * |  |
   * |--|-------------------------------------------------------------- inner grid
   * |--|-------------------------------------------------------------- grid line
   * |--|-------------------------------------------------------------- container
   */
  private calculateGridMetrics() {
    this._containerEl = document.querySelector('app-tab-grid');

    if (!this._containerEl) {
      return;
    }

    const gsCurrentHeight = $(this._gridEl).attr('data-gs-current-height');
    // const rows = !isNullOrUndefined(gsCurrentHeight) && gsCurrentHeight > this._rows ? gsCurrentHeight : this._rows;
    const rows = this._rows;

    const timeExplorer = document.querySelector('app-time-explorer-container');
    const globalFilters = document.querySelector('#globalFilters');
    const tabHeader = document.querySelector('mat-tab-header');
    const body = document.body;

    const top = parseFloat(this.getComputedStyle('padding-top', this._containerEl));
    const right = parseFloat(this.getComputedStyle('padding-right', this._containerEl));
    const bottom = parseFloat(this.getComputedStyle('padding-bottom', this._containerEl));
    const left = parseFloat(this.getComputedStyle('padding-left', this._containerEl));
    const padding = {top, right, bottom, left};
    const innerGridHeight = body.scrollHeight - timeExplorer.clientHeight - globalFilters.clientHeight
      - tabHeader.clientHeight - padding.top - padding.bottom;
    const innerGridWidth = this._containerEl.clientWidth - padding.left - padding.right;
    const gridLinesHeight = innerGridHeight + padding.top / 2 + padding.bottom / 2;
    const gridLinesWidth = innerGridWidth;
    const gridLinesRowWidth = gridLinesWidth / this._columns;
    const gridLinesRowHeight = gridLinesHeight / rows;

    const totalRowsHeight = innerGridHeight - GridService.DEFAULT_VERTICAL_MARGIN * (rows - 1);
    const innerRowHeight = Math.floor(totalRowsHeight / rows);

    const totalRowsWidth = innerGridWidth - GridService.DEFAULT_VERTICAL_MARGIN * (this._columns - 1);
    const innerRowWidth = Math.floor(totalRowsWidth / this._columns);

    this._metrics = {
      innerGridHeight,
      innerGridWidth,
      innerRowHeight,
      innerRowWidth,
      gridLinesHeight,
      gridLinesWidth,
      gridLinesRowHeight,
      gridLinesRowWidth,
      padding
    };
  }

  private setGridMinHeight() {
    const $grid = $(this._gridEl);
    $grid.css({minHeight: `${this.metrics.innerRowHeight * this._rows + (this._rows - 1) * GridService.DEFAULT_VERTICAL_MARGIN}px`});
  }

  private getComputedStyle(style: string, el: Element): string {
    return window.getComputedStyle(el, null).getPropertyValue(style);
  }

  private createWidgetAt(placeholder: Placeholder, mouseX: number, mouseY: number) {
    const $widget = this.createWidgetElement(placeholder);
    $widget.detach();
    $widget.appendTo('body');
    this.setWidgetStyle($widget, placeholder, mouseX, mouseY);
    return $widget;
  }

  private setWidgetStyle($widget: any, placeholder: Placeholder, mouseX: number, mouseY: number) {
    const width = this._grid.cellWidth() * placeholder.size.columns;
    const height = this._grid.cellHeight() * placeholder.size.rows;
    const top = mouseY - 24;
    const left = mouseX - width / 2;

    $widget.css({
      width,
      height,
      top,
      left,
      position: 'absolute',
      visibility: 'hidden'
    });
  }

  private makeWidgetDraggable($widget: any, event: MouseEvent) {
    $widget.addClass('widget-clone');
    $widget.draggable({
      containment: 'body',
      stack: '.grid-stack',
      delay: 200,
      start: (e, ui) => {
        this.onDragStart.next(this.getDragEvent(e, ui));
        $widget.removeClass('widget-clone');
        $widget.css({visibility: 'visible'});
      },
      drag: (e, ui) => {
        this.onDrag.next(this.getDragEvent(e, ui));
      },
      stop: (e, ui) => {
        this.onDragStop.next(this.getDragEvent(e, ui));
        $widget.remove();
      }
    });
    $widget.trigger($.event.fix(event));
  }

  private gridItemAttributes($item): Placeholder {
    const id = $item.attr('data-id');
    const widgetId = $item.attr('data-widget-id');
    const x = +$item.attr('data-gs-x');
    const y = +$item.attr('data-gs-y');
    const columns = +$item.attr('data-gs-width');
    const rows = +$item.attr('data-gs-height');
    const tabId = $item.attr('data-tab-id');
    return {
      id,
      widgetId,
      size: {rows, columns},
      position: {x, y},
      tabId
    };
  }

  private createWidgetElement(placeholder: Placeholder) {
    const {id, widgetId} = placeholder;
    const avatar = placeholder.avatar ? placeholder.avatar : '';
    const launcherItemHtml = `<launcher-item-container placeholder-id="${id}" avatar="${avatar}"></launcher-item-container>`;
    const $content = $(launcherItemHtml).addClass('grid-stack-item-content');
    return $('<div class="grid-stack-item"></div>').append($content)
      .attr('data-id', id)
      .attr('data-widget-id', widgetId)
      .attr('data-tab-id', placeholder.tabId)
      .attr('data-avatar', placeholder.avatar);
  }

  private getDragEvent(e, ui): DragEvent {
    return {originalEvent: e.originalEvent.originalEvent, position: ui.position, target: ui.helper[0], type: 'widget'};
  }
}
