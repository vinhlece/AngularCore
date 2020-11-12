import {Observable, Subject} from 'rxjs';
import {ActionWithPayload} from '../../common/actions';
import {Widget} from '../../widgets/models';
import {Placeholder, PlotPoint, PollingConfig, UpdateMetricsPayload} from '../models';

export interface WorkerService {
  transferAction(action: ActionWithPayload<any>): void;

  onResponse(): Subject<any>;
}

export interface DashboardNavigator {
  navigateToDashboardList();

  navigateToDashboardDetails(id: string);
}

export interface PollingConfigService {
  load(): Observable<PollingConfig>;
}

export interface Exporter {
  exportData(data: any, fileName: string);
}

export interface PlaceholdersService {
  findById(id: string): Observable<Placeholder>;
}

export interface PlotEditor {
  updateSideEffects(widget: Widget, point: PlotPoint, sideEffect, value): Widget;

  updateMetrics(options: UpdateMetricsPayload): Widget;
}
