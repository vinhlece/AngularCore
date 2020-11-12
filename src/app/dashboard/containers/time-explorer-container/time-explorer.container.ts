import {Component, EventEmitter, HostListener, Inject, Input, OnInit, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {TimeUtils} from '../../../common/services/index';
import {TIME_UTILS} from '../../../common/services/tokens';
import * as replayActions from '../../actions/replay.actions';
import * as tabEditorActions from '../../actions/tab-editor.actions';
import * as timeExplorerActions from '../../actions/time-explorer.actions';
import * as pollingActions from '../../actions/time-preferences.actions';
import {Dashboard, PredictiveSetting, TimeRangeInterval, TimeRangeSetting} from '../../models';
import {PREDICTIVE_RANGE_SETTINGS, TIME_RANGE_SETTINGS} from '../../../common/models/constants';
import {ReplayStatus} from '../../models/enums';
import * as fromDashboards from '../../reducers';
import {ColorPalette, InstanceColor} from '../../../common/models/index';
import * as fromEntities from '../../../reducers/index';
import {User} from '../../../user/models/user';
import * as fromUsers from '../../../user/reducers/index';
import * as colorPaletteActions from '../../../user/actions/palette.actions';
import {Logging, LogLevel} from '../../../config/app.config';
import * as placeholdersActions from '../../actions/placeholders.actions';
import {AppConfigService} from '../../../app.config.service';
import {isNullOrUndefined} from 'util';
import * as InstanceColorActions from '../../actions/instance-color.actions';
import * as InstanceColorsActions from '../../actions/instance-color.actions';

@Component({
  selector: 'app-time-explorer-container',
  templateUrl: './time-explorer.container.html'
})
export class TimeExplorerContainer implements OnInit {
  private _store: Store<fromDashboards.State>;
  private _timeUtils: TimeUtils;
  private _appConfigService: AppConfigService;

  @Input() dashboard: Dashboard;

  currentTimestamp$: Observable<number>;
  replayStatus$: Observable<ReplayStatus>;
  currentSettings$: Observable<TimeRangeSetting>;
  availableSettings: TimeRangeSetting[];
  predictiveSettings$: Observable<PredictiveSetting>;
  palettes$: Observable<ColorPalette[]>;
  loginInformation$: Observable<User>;
  instanceColors$: Observable<InstanceColor[]>;
  loggingMode: Logging;

  @Output() onToggleGlobalFilter = new EventEmitter<void>();
  @Output() onClickAddWidget = new EventEmitter<void>();
  @Output() onClickAddLabelWidget = new EventEmitter<string>();

  constructor(store: Store<fromDashboards.State>, @Inject(TIME_UTILS) timeUtils: TimeUtils,
              appConfigService: AppConfigService) {
    this._store = store;
    this._timeUtils = timeUtils;
    this._appConfigService = appConfigService;
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardInput(event: KeyboardEvent) {
    // if press spacebar and target is not an input element
    if (event.key === ' ' && !(event.target as HTMLInputElement).type) {
      this.handleToggleReplay();
    }
  }

  ngOnInit() {
    this.currentSettings$ = this._store.pipe(select(fromDashboards.getTimeRangeSettings));
    this.currentTimestamp$ = this._store.pipe(select(fromDashboards.getCurrentTimestamp));
    this.replayStatus$ = this._store.pipe(select(fromDashboards.getReplayStatus));
    this.availableSettings = TIME_RANGE_SETTINGS;
    this.predictiveSettings$ = this._store.pipe(select(fromDashboards.getPredictiveSettings));
    this.palettes$ =  this._store.pipe(select(fromEntities.getNormalizedPalettes));
    this.loginInformation$ = this._store.pipe(select(fromUsers.getAuthenticatedUser));
    this.instanceColors$ = this._store.pipe(select(fromDashboards.getInstanceColors));
    this.loggingMode = this._appConfigService.config.logging;
  }

  handleChangeTimeSetting(timeRangeSettings: TimeRangeSetting) {
    this._store.dispatch(new pollingActions.SelectTimeRangeSettings(timeRangeSettings));
  }

  handleChangePredictiveSetting(predictiveSetting: PredictiveSetting) {
    this._store.dispatch(new pollingActions.SelectPredictiveSettings(predictiveSetting));
  }

  handleChangeTimestamp(timestamp: number) {
    this._store.dispatch(new pollingActions.GoBack(timestamp));
  }

  handleOpen() {
    this._store.dispatch(new timeExplorerActions.Open());
  }

  handleClose() {
    this._store.dispatch(new timeExplorerActions.Close());
  }

  handleOpened() {
    this._store.dispatch(new tabEditorActions.AdjustSize());
  }

  handleClosed() {
    this._store.dispatch(new tabEditorActions.AdjustSize());
  }

  handleToggleReplay() {
    this._store.dispatch(new replayActions.Toggle());
  }

  handleChangeColorPalette(palette: ColorPalette) {
    this._store.dispatch(new colorPaletteActions.ChangeColorPalette(palette));
  }

  handleToggleGlobalFilter(event: MouseEvent) {
    this.onToggleGlobalFilter.emit();
  }

  handleAddWidget(event) {
    this.onClickAddWidget.emit(event);
  }

  handleAddLabelWidget(event) {
    this.onClickAddLabelWidget.emit(event);
  }

  handleLoggineMode(event: LogLevel) {
    this.loggingMode = {log: !isNullOrUndefined(event), level: event};
    this._appConfigService.config.logging = this.loggingMode;
    this._store.dispatch(new placeholdersActions.SetLoggingMode(event));
  }

  handleDropTimestamp() {
    this._store.dispatch(new timeExplorerActions.SetTimestamp());
  }

  handleUpdateInstanceColor(event) {
    this._store.dispatch(new InstanceColorActions.Update(event));
  }

  handleDeleteInstanceColor(event) {
    this._store.dispatch(new InstanceColorActions.Delete(event));
  }

  handleEditInstanceColor(event) {
    this._store.dispatch(new InstanceColorActions.Edit(event));
  }
}
