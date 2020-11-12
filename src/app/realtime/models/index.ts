import {Placeholder, TimeRange, TimeRangeInterval} from '../../dashboard/models';
import {DisplayMode} from '../../dashboard/models/enums';
import {QueryItem} from '../../shared/collection';
import {Widget} from '../../widgets/models';
import {Collection} from './collection';
import {Measure} from '../../measures/models/index';
import {ConvertMode} from './enum';

export type WidgetData = any;

export type GroupKey = string;

export type DataGroup = any;

export type DataSet = RealtimeData[];

export interface Storage {
  records: RealtimeData[];

  collections?: Collection[];

  newCollections?: Collection[];

  updatedCollections?: Collection[];

  removedCollections?: Collection[];

  path: string | number;

  insert(record: RealtimeData, processStrategy?: ProcessStrategy): RealtimeData;

  update(record: RealtimeData, processStrategy?: ProcessStrategy): RealtimeData;

  bulkInsert(records: RealtimeData[], processStrategy?: ProcessStrategy);

  upsert(record: RealtimeData, processStrategy?: ProcessStrategy): RealtimeData;

  bulkUpsert(records: RealtimeData[], processStrategy?: ProcessStrategy);

  remove(record: RealtimeData): boolean;

  bulkRemove(records: RealtimeData[]);

  rebase(processStrategy?: ProcessStrategy);

  resetRecordsState();

  getRecord(record: RealtimeData): RealtimeData;

  find(query: QueryItem): Storage[];

  findRecords(query: { [item: string]: QueryItem }): RealtimeData[];

  findWidgetRecords(widget: Widget, goBackTimestamp: TimeRange, displayMode?: DisplayMode | ConvertMode): RealtimeData[];

  size(): number;

  isEmpty(): boolean;

  clone(): Storage;
}

export interface ProcessStrategy {
  process(record: RealtimeData): RealtimeData;
  updateMainTimeRange(mainTimeRange: TimeRange): void;
}

export interface Segment {
  timeRange?: TimeRange;
  dataPointInterval?: TimeRangeInterval;
  dirty?: boolean;
}

export interface Subscription {
  username: string;
  packageName: string;
  kafkaStream: string;
  id: string;
}

export interface BaseRealTimeData {
  dimension?: string;
  window?: string;
  instance?: string;
  measureName?: string;
  measureValue?: number | string;
  measureTimestamp?: number;
  dataType?: string;
  segmentType?: string;
  agent?: string;
  queue?: string;
  callID?: string;
}

export interface RealtimeData extends BaseRealTimeData {
  // dynamic properties
  // [x: string]: any;
  group?: number;
  metricCalcType?: string;
}

export interface StartOptions {
  dataType?: string;
  id?: string;
  startDate: number;
  endDate: number;
  clientId: string;
  dimensions?: string;
  measure?: string;
  windowName?: string;
  windowType?: string;
}

export interface PumpupOptions extends StartOptions {
  instances: string[];
}

export interface Stream {
  dataType: string;
  instance: string;
  range?: TimeRange;
  dirty?: boolean;
}

export interface Topic {
  subscriptionId?: string;
  dataType?: string;
  name?: string;
  isSubscribed?: boolean;
  channel?: string;
  clientId?: string;
  measures?: Measure[];
}

export interface PollingInterval {
  initialDelay: number;
  timerInterval: number;
  debounce: number;
  convertDelay: number;
}

export interface LaunchingWidget extends Widget {
  placeholder: Placeholder;
  displayMode: DisplayMode;
}

export interface USState {
  abbrev?: string;
  parentState?: string;
  capital?: string;
  lat?: number;
  lon?: number;
  population?: number;
}

export interface PolicyGroup {
  actionPolicies: ActionPolicy[];
 }

export interface ActionPolicy {
  policyIdentifier: PolicyIdentifier;
  enabled: boolean;
  entryIdentifiers: EntryIdentifier[];
  triggers: Trigger[];
  actions?: PolicyAction[];
}

export interface PolicyIdentifier {
  policyGroupId: string;
  actionPolicyId: string;
}

export interface KPIPolicyItem {
  hour: number;
  maxValue: number;
  minValue: number;
}

export interface PolicyInfo {
  measure: string;
  instance: string;
  windowName: string;
  windowType: string;
}

export interface EntryIdentifier {
  keyPath: string;
  identificationType: string;
  value: string;
}

export interface Trigger {
  keyPath: string;
  triggerType: string;
  value: string;
}

export interface PolicyAction {
  type: string;
  priority: string;
  emailAddress: string;
  emailBody: string;
}

export interface PolicyStorage {
  id: string;
  instance: string;
  measure: string;
}
