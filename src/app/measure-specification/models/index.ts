import {DurationType, MeasureMetricTypes} from './enums';
import {WidgetWindow} from '../../widgets/models/index';

export interface EventTag {
  id?: string;
  name: string;
  query?: string;
}

export interface EventQualifier {
  id: string;
  name: string;
  operator: string;
  parameters: ParameterQualifier[];
}

export interface ParameterQualifier {
  type: string;
  name: string;
  value: string;
}

export interface MeasureEvent {
  eventName: string;
  field: string;
  action: DurationType;
}

export interface MeasureSpecification {
  measureName: string;
  processorType: MeasureMetricTypes;
  events: MeasureEvent[];
  dimensions: string[][];
  measureWindows: WidgetWindow[];
  packages: string[];
  correlationIdentifiers: string;
  createdBy?: string;
}

export interface EventMapping {
  id: string;
  name: string;
  eventStreamId: string;
  qualifierNames: string[];
  mapping: EventMappingBody[];
  source?: string;
}

export interface EventMappingBody {
  sourceName: string;
  targetName: string;
  measureDataType: string;
}

export interface EventStream {
  id: string;
  name: string;
  source?: string;
}
