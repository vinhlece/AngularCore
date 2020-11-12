import {Topic} from '../index';

export interface WidgetContainer {
  id: string;
  dataType: string;
  widgetIds: string[];
  subscription: WebSocketSubscription;
}

export interface WebSocketSubscription {
  id?: string;
  measureNames?: string[];
  user?: string;
  topic?: Topic;
  token?: string;
  sessionId?: string;
  isSubscribed?: boolean;
  measureFilters?: MeasureFilter[];
  packageName?: string;
}

export interface MeasureFilter {
  measure: string;
  dimensionFilters: DimensionFilter[];
  windows?: string[];
}

export interface DimensionFilter {
  dimension: string;
  included: string[];
}

