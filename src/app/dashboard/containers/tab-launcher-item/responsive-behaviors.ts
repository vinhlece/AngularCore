import {ElementRef} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {combineLatest, EMPTY, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Dimension} from '../../../charts/models';
import {GridMetrics, Placeholder} from '../../models';
import * as fromDashboards from '../../reducers';
import {Widget} from '../../../widgets/models/index';
import * as fromWidgets from '../../../widgets/reducers/index';
import * as fromUser from '../../../user/reducers/index';
import {ColorPalette} from '../../../common/models/index';

export interface ResponsiveBehavior {
  getChartSize(el: ElementRef): Observable<Dimension>;
}

export class DoNotResponsive implements ResponsiveBehavior {
  getChartSize(el: ElementRef): Observable<Dimension> {
    return EMPTY;
  }
}

export class ResponsiveBehaviorImpl implements ResponsiveBehavior {
  private _store: Store<fromDashboards.State>;
  private _placeholderId: string;

  constructor(store: Store<fromDashboards.State>, placeholderId: string) {
    this._store = store;
    this._placeholderId = placeholderId;
  }

  getChartSize(el: ElementRef): Observable<Dimension> {
    const placeholder$ = this._store.pipe(select(fromDashboards.getPlaceholderById(this._placeholderId)));
    const metrics$ = this._store.pipe(select(fromDashboards.getMetrics));
    const widgets$ = this._store.pipe(select(fromWidgets.getWidgets));
    const colorPallete$ = this._store.pipe(select(fromUser.getCurrentColorPalette));

    return combineLatest(placeholder$, metrics$, widgets$, colorPallete$).pipe(
      map(([placeholder, metrics, widgets, colorPallete]) => {
        const widget = widgets.find(item => item.id === placeholder.widgetId);
        const width = el.nativeElement.offsetWidth;
        const height = this.getHeight(placeholder, el, metrics, widget, colorPallete);
        return {width, height};
      })
    );
  }

  private getHeight(placeholder: Placeholder, el: ElementRef, metrics: GridMetrics,
                    widget: Widget, colorPallete: ColorPalette): number {
    const hasSubtitle = widget && widget.subtitle && widget.subtitle.trim().length > 0;
    let headerHeight = hasSubtitle ? 50 : 30;
    if (colorPallete && colorPallete.headerFont && colorPallete.headerFont.fontSize) {
      const tempHeaderHeight = colorPallete.headerFont.fontSize;
      headerHeight = hasSubtitle ? tempHeaderHeight * 3.5 : tempHeaderHeight + 16;
    }
    return el.nativeElement.offsetHeight === 0
      ? metrics.innerRowHeight * placeholder.size.rows + (placeholder.size.rows - 1) * 20 - headerHeight
      : el.nativeElement.offsetHeight - headerHeight;
  }
}
