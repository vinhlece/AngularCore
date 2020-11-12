import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {State} from '../../../reducers';
import {RouterStateUrl} from '../../../common/route/RouterStateUrl';
import {getRouteInformaton} from '../../../common/route/selectors';
import {WidgetType} from '../../constants/widget-types';
import {commonRouterList} from '../../../common/models/constants';

@Component({
  selector: 'app-edit-widget-nav',
  styleUrls: ['./edit-widget-nav.component.scss'],
  templateUrl: './edit-widget-nav.component.html',
})
export class EditWidgetNavComponent implements OnInit, OnDestroy {
  private _id: string;
  private _type: string;
  private _store: Store<State>;
  private _unsubscribe = new Subject<void>();

  routerList = commonRouterList('/widgets');

  constructor(store: Store<State>) {
    this._store = store;
  }

  get isBar(): boolean {
    return this._type === WidgetType.Bar;
  }

  get isTrendDiff(): boolean {
    return this._type === WidgetType.TrendDiff;
  }

  get isBillboard(): boolean {
    return this._type === WidgetType.Billboard;
  }

  get isLiquidFillGauge(): boolean {
    return this._type === WidgetType.LiquidFillGauge;
  }

  get isLine(): boolean {
    return this._type === WidgetType.Line;
  }

  get isSankey(): boolean {
    return this._type === WidgetType.Sankey;
  }

  get isSolidGauge(): boolean {
    return this._type === WidgetType.SolidGauge;
  }

  get isSunburst(): boolean {
    return this._type === WidgetType.Sunburst;
  }

  get isCallTimeLine(): boolean {
    return this._type === WidgetType.CallTimeLine;
  }

  get isBubble(): boolean {
    return this._type === WidgetType.Bubble;
  }

  get isGeoMap(): boolean {
    return this._type === WidgetType.GeoMap;
  }
  get isTabular(): boolean {
    return this._type === WidgetType.Tabular;
  }

  get id(): string {
    return this._id;
  }

  ngOnInit() {
    this._store
      .pipe(
        select(getRouteInformaton),
        takeUntil(this._unsubscribe),
        filter(item => !isNullOrUndefined(item))
      )
      .subscribe((item: RouterStateUrl) => {
        this.getURLInfo(item);
      });
  }

  ngOnDestroy(): void {
    if (this._unsubscribe) {
      this._unsubscribe.next();
    }
  }

  private getURLInfo(url: RouterStateUrl) {
    const urlArray = url.url.split('/');
    this._id = urlArray[2];
    if (url.queryParams && url.queryParams.type) {
      this._type = url.queryParams.type;
    } else {
      this._type = '';
    }
  }
}
