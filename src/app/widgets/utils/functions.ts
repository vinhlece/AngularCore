import {ChartIcons} from '../models/enums';
import { WidgetType } from '../constants/widget-types';

export function getChartThumbnail(chartId: string) {
  return `assets\\img\\chart_thumbnails_svg\\${ChartIcons[chartId]}.svg`;
}

export function getSelectionName(name: string) {
  return `selections_${name.trim().replace(' ', '_')}`;
}

/**
 * TODO Should modify widget abstractions to cater for different widget categories.
 * Distinguish between chart and non chart widgets.
 * @param type type of widget
 */
export function isChartWidget(type: WidgetType) {
  return type !== WidgetType.LabelWidget && type !== WidgetType.EventViewer;
}
