import {Inject, Injectable} from '@angular/core';
import {ChartDataConverterService} from '.';
import {TimeRange, TimeRangeInterval} from '../../../dashboard/models';
import {DisplayMode, TimeRangeType} from '../../../dashboard/models/enums';
import {WidgetMode, WidgetType} from '../../../widgets/constants/widget-types';
import {
  BarMode,
  BarWidget,
  BillboardWidget,
  CallTimeLineWidget,
  GeoMapWidget,
  LineWidget,
  SankeyWidget,
  SolidGaugeWidget,
  SunburstWidget,
  TabularWidget, TimeGroup,
  TrendDiffWidget,
  Widget,
  LiquidFillGaugeWidget, BubbleWidget, KpiThresholds
} from '../../../widgets/models';
import {CallTimeLineGroupBy, DataDisplayType, TimeGroupBy, TrendType} from '../../../widgets/models/enums';
import {GeoMapAdapter} from '../adapter/geo-map';
import {MatTableDataAdapter} from '../adapter/table';
import {TrendDiffAdapter} from '../adapter/trenddiff';
import {ChartDataBuilder} from '../builder';
import {HighchartsBarDataBuilder} from '../builder/bar';
import {BillboardDataBuilder} from '../builder/billboard';
import {CallTimelineBuilder} from '../builder/call-timeline';
import {GeoMapDataBuilder} from '../builder/geo-map';
import {HighchartsLineDataBuilder} from '../builder/line';
import {HighchartsSankeyDataBuilder} from '../builder/sankey';
import {SolidGaugeDataBuilder} from '../builder/solid-gauge';
import {SunburstDataBuilder} from '../builder/sunburst';
import {TabularDataBuilder} from '../builder/tabular';
import {HighchartsDayTrendDiffDataBuilder, HighchartsShiftTrendDiffDataBuilder} from '../builder/trenddiff';
import {Grouper} from '../grouper/grouper';
import {
  InstanceMeasureGrouper, InstanceTimestampGrouper, MeasureTimestampGrouper, WindowInstanceGrouper,
  WindowInstanceMeasureGrouper, WindowMeasureGrouper
} from '../grouper/pair';
import {
  AgentGrouper,
  CallIdGrouper,
  InstanceGrouper,
  MeasureGrouper,
  QueueGrouper,
  SegmentTypeGrouper
} from '../grouper/single';
import {DateGrouper, ShiftGrouper} from '../grouper/trenddiff';
import {ConverterOptions, DataConverterFactory, RealTimeDataProcessor} from '../index';
import {Interceptor} from '../interceptor';
import {CompositeInterceptor} from '../interceptor/composite';
import {DefaultInterceptor} from '../interceptor/default';
import {
  AgentFilter, InputRangeFilter, InputRangeIntervalFilter, InstanceFormatFilter,
  KeyMeasureFilter, KpiFilter,
  LatestFilter,
  LatestPreviousFilter, LatestPreviousTimestampFilter,
  MeasureFilter,
  PreviousFilter,
  QueueFilter,
  SegmentTypeFilter, TimestampFilter, TrendDiffTimeFilter
} from '../interceptor/filter';
import {FormulaMeasureInjector} from '../interceptor/injector';
import {TimestampNormalizer} from '../interceptor/normalizer';
import {InstanceTimestampSorter, MeasureValueSorter, TimestampSorter} from '../interceptor/sorter';
import {REAL_TIME_DATA_PROCESSOR} from '../tokens';
import {Converter} from './converter';
import {ColorPalette, InstanceColor} from '../../../common/models/index';
import * as _ from 'lodash';
import {TimeUtils} from '../../../common/services/index';
import {TIME_UTILS} from '../../../common/services/tokens';
import {getCurrentMoment} from '../../../common/services/timeUtils';
import {TimeRangeAll} from '../../../widgets/constants/constants';
import {getDefaultValue, unionInstances} from '../../../common/utils/function';
import {Key} from '../../../widgets/models/constants';
import { LiquidFillGaugeDataBuilder } from '../builder/liquidfillgauge';
import {HighchartsBuubleDataBuilder} from '../builder/bubble';

export abstract class AbstractDataConverterFactory implements DataConverterFactory {
  private _realTimeDataProcessor: RealTimeDataProcessor;
  private _timeUtils: TimeUtils;

  constructor(realTimeDataProcessor: RealTimeDataProcessor, timeUtils: TimeUtils) {
    this._realTimeDataProcessor = realTimeDataProcessor;
    this._timeUtils = timeUtils;
  }

  get processor(): RealTimeDataProcessor {
    return this._realTimeDataProcessor;
  }

  createBarConverter(widget: BarWidget, options: ConverterOptions): ChartDataConverterService {
    const interceptor = this.createBarInterceptor(widget, options);
    const grouper = this.createBarGrouper(widget);
    const builder = this.createBarBuilder(widget, options);
    return new Converter(interceptor, grouper, builder);
  }

  createBillboardConverter(widget: BillboardWidget, options: ConverterOptions): ChartDataConverterService {
    const interceptor = this.createBillboardInterceptor(widget, options);
    const grouper = this.createBillboardGrouper();
    const builder = this.createBillboardBuilder(options.colorPalette);
    return new Converter(interceptor, grouper, builder);
  }

  createLiquidFillGaugeConverter(widget: LiquidFillGaugeWidget, options: ConverterOptions): ChartDataConverterService {
    const interceptor = this.createLiquidFillGaugeInterceptor(widget, options);
    const grouper = this.createLiquidFillGaugeGrouper();
    const builder = this.createLiquidFillGaugeBuilder(options.colorPalette);
    return new Converter(interceptor, grouper, builder);
  }

  createLineConverter(widget: LineWidget, options: ConverterOptions): ChartDataConverterService {
    const filter = this.createLineInterceptor(widget, options);
    const grouper = this.createLineGrouper();
    const builder = this.createLineBuilder(options.colorPalette, options.instanceColors, widget);
    return new Converter(filter, grouper, builder);
  }

  createTrendDiffConverter(widget: TrendDiffWidget, options: ConverterOptions): ChartDataConverterService {
    const interceptor = this.createTrendDiffInterceptor(widget, options);
    const grouper = this.createTrendDiffGrouper(widget, options);
    const builder = this.createTrendDiffBuilder(widget, options.colorPalette);
    const converter = new Converter(interceptor, grouper, builder);
    return new TrendDiffAdapter(converter, widget);
  }

  createTabularConverter(tabularWidget: TabularWidget, options: ConverterOptions) {
    const interceptor = this.createTabularInterceptor(tabularWidget, options);
    const grouperService = this.createTabularGrouper(tabularWidget);
    const builder = this.createTabularBuilder(tabularWidget, options.colorPalette);
    const converter = new Converter(interceptor, grouperService, builder);
    return new MatTableDataAdapter(converter, tabularWidget);
  }

  createSankeyConverter(widget: SankeyWidget, options: ConverterOptions) {
    const interceptor = this.createSankeyInterceptor(widget, options);
    const grouper = this.createSankeyGrouper();
    const builder = this.createSankeyBuilder(widget, options.colorPalette, options.instanceColors);
    return new Converter(interceptor, grouper, builder);
  }

  createSolidGaugeConverter(widget: SolidGaugeWidget, options: ConverterOptions): ChartDataConverterService {
    const interceptor = this.createSolidGaugeInterceptor(widget, options);
    const grouper = this.createSolidGaugeGrouper();
    const builder = this.createSolidGaugeBuilder(options.colorPalette);
    return new Converter(interceptor, grouper, builder);
  }

  createSunburstConverter(widget: SunburstWidget, options: ConverterOptions): ChartDataConverterService {
    const interceptor = this.createSunburstInterceptor(widget, options);
    const grouper = this.createSunburstGrouper();
    const builder = this.createSunburstBuilder(options.colorPalette, options.instanceColors);
    return new Converter(interceptor, grouper, builder);
  }

  createGeoMapConverter(widget: GeoMapWidget, options: ConverterOptions): ChartDataConverterService {
    const interceptor = this.createGeoMapInterceptor(widget, options);
    const grouper = this.createGeoMapGrouper();
    const builder = this.createGeoMapBuilder(widget, options.colorPalette, options.instanceColors);
    const converter = new Converter(interceptor, grouper, builder);
    return new GeoMapAdapter(converter, widget);
  }

  createCallTimeLineConverter(widget: CallTimeLineWidget, options: ConverterOptions): any {
    const interceptor = this.createCallTimeLineInterceptor(widget, options);
    const grouper = this.createCallTimeLineGrouper(widget.groupBy);
    const builder = this.createCallTimeLineBuilder(widget, options.colorPalette);
    return new Converter(interceptor, grouper, builder);
  }

  createBubbleConverter(widget: BubbleWidget, options: ConverterOptions): any {
    const interceptor = this.createBubbleInterceptor(widget, options);
    const grouper = this.createBubbleGrouper();
    const builder = this.createBubbleBuilder(widget, options.colorPalette);
    return new Converter(interceptor, grouper, builder);
  }

  private createBarInterceptor(widget: BarWidget, options: ConverterOptions): Interceptor {
    const instanceMeasureFilter = this.createCommonInterceptor(widget, options.globalFilters);
    const prevTimestamp = options.goBackTimeRange ? options.goBackTimeRange.endTimestamp : null;
    const historicalTimeStamp = widget.timestamps && widget.timestamps.length !== 0 ?
      widget.timestamps[widget.timestamps.length - 1] : null;
    const latPrevFilter = this.createHistoricalFilter(prevTimestamp, historicalTimeStamp, getDefaultValue(options.realTimeMode, widget.id));
    const formulaInterceptor = this.createFormulaMeasuresInjector(widget.dataType, widget.measures);
    const measuresFilter = this.createMeasuresFilter(widget.dataType, widget.measures);
    const inputRangeFilter = this.createInputRangeFilter(widget.mode, options.mainTimeRange, widget.timestamps);
    if (widget.mode.value === WidgetMode.TimeRange && inputRangeFilter) {
      const sorter = this.createTimestampSorter();
      return this.composeInterceptor(instanceMeasureFilter, formulaInterceptor, measuresFilter, inputRangeFilter, sorter);
    }
    return this.composeInterceptor(instanceMeasureFilter, latPrevFilter, formulaInterceptor, measuresFilter);
  }

  private createLineInterceptor(widget: LineWidget, options: ConverterOptions): Interceptor {
    const instanceMeasureFilter = this.createCommonInterceptor(widget, options.globalFilters);
    const formulaInterceptor = this.createFormulaMeasuresInjector(widget.dataType, widget.measures);
    const measuresFilter = this.createMeasuresFilter(widget.dataType, widget.measures);
    let timestampNormalizer;
    const kpiFilter = this.createKpiFilter(widget.hideKPI);
    const timestamps = widget.timestamps && widget.timestamps.length > 0 ? widget.timestamps : null;
    if (widget.customTimeRange && widget.customTimeRange.interval &&
      widget.customTimeRange.interval.value && widget.customTimeRange.interval.unit) {
      const input = widget.customTimeRange.interval;
      const type = input.unit.toString();
      const interval = {
        value: input.value,
        type: TimeRangeType[type]
      };
      timestampNormalizer = this.createTimestampNormalizer(interval, timestamps);
    } else {
      if (options.currentTimeRange && options.currentTimeRange.type === TimeRangeType.Minute && (options.currentTimeRange.value < 20)) {
        timestampNormalizer = this.createTimestampNormalizer({value: 1, type: TimeRangeType.Second}, timestamps);
      } else if (options.currentTimeRange && options.currentTimeRange.type === TimeRangeType.Minute && options.currentTimeRange.value === 20) {
        timestampNormalizer = this.createTimestampNormalizer({value: 3, type: TimeRangeType.Second}, timestamps);
      } else {
        timestampNormalizer = this.createTimestampNormalizer({value: 1, type: TimeRangeType.Minute}, timestamps);
      }
    }
    return this.composeInterceptor(instanceMeasureFilter, timestampNormalizer, formulaInterceptor, measuresFilter, kpiFilter);
  }

  private createTrendDiffInterceptor(widget: TrendDiffWidget, options: ConverterOptions): Interceptor {
    const instanceMeasureFilter = this.createCommonInterceptor(widget);
    const formulaInterceptor = this.createFormulaMeasuresInjector(widget.dataType, widget.measures);
    const measuresFilter = this.createMeasuresFilter(widget.dataType, widget.measures);
    const sorter = this.createTimestampSorter();

    if (widget.timestamps && widget.timestamps.length > 0 && widget.trendType === TrendType.Day) {
      const timestampFilter = this.createTrendDiffTimeFilter(widget.timestamps);
      return this.composeInterceptor(instanceMeasureFilter, formulaInterceptor, measuresFilter, timestampFilter, sorter);
    }

    return this.composeInterceptor(instanceMeasureFilter, formulaInterceptor, measuresFilter, sorter);
  }

  private createBillboardInterceptor(widget: BillboardWidget, options: ConverterOptions): Interceptor {
    const instancesMeasuresFilter = this.createCommonInterceptor(widget);

    const prevTimestamp = options.goBackTimeRange ? options.goBackTimeRange.endTimestamp : null;
    const historicalTimeStamp = widget.timestamps && widget.timestamps.length > 0 ? widget.timestamps[0] : null;
    let realTimeMode = getDefaultValue(options.realTimeMode, widget.id);
    if (!realTimeMode && !historicalTimeStamp) {
      realTimeMode = true;
    }
    const latestPreviousFilter = this.createHistoricalTimestampFilter(prevTimestamp, historicalTimeStamp, realTimeMode);

    const formulaInterceptor = this.createFormulaMeasuresInjector(widget.dataType, widget.measures);
    const measuresFilter = this.createMeasuresFilter(widget.dataType, widget.measures);
    return this.composeInterceptor(instancesMeasuresFilter, latestPreviousFilter, formulaInterceptor, measuresFilter);
  }

  private createLiquidFillGaugeInterceptor(widget: LiquidFillGaugeWidget, options: ConverterOptions): Interceptor {

    const instancesMeasuresFilter = this.createCommonInterceptor(widget);

    const prevTimestamp = options.goBackTimeRange ? options.goBackTimeRange.endTimestamp : null;
    const historicalTimeStamp = widget.timestamps && widget.timestamps.length > 0 ? widget.timestamps[0] : null;
    let realTimeMode = getDefaultValue(options.realTimeMode, widget.id);
    if (!realTimeMode && !historicalTimeStamp) {
      realTimeMode = true;
    }
    const latestPreviousFilter = this.createHistoricalTimestampFilter(prevTimestamp, historicalTimeStamp, realTimeMode);

    const formulaInterceptor = this.createFormulaMeasuresInjector(widget.dataType, widget.measures);
    const measuresFilter = this.createMeasuresFilter(widget.dataType, widget.measures);
    return this.composeInterceptor(instancesMeasuresFilter, latestPreviousFilter, formulaInterceptor, measuresFilter);
  }

  private createTabularInterceptor(tabularWidget: TabularWidget, options: ConverterOptions): Interceptor {
    return (tabularWidget.displayData === DataDisplayType.ShowInterval)
      ? this.createHistoricalTableInterceptor(tabularWidget, options)
      : this.createLatestTableInterceptor(tabularWidget, options);
  }

  private createHistoricalTableInterceptor(widget: TabularWidget, options: ConverterOptions): Interceptor {
    const instanceMeasureFilter = this.createCommonInterceptor(widget, options.globalFilters);
    const formulaInterceptor = this.createFormulaMeasuresInjector(widget.dataType, widget.measures);
    const measuresFilter = this.createMeasuresFilter(widget.dataType, widget.measures);
    const sorter = this.createInstanceTimestampSorter();
    if (widget.customTimeRange && widget.customTimeRange.type && widget.customTimeRange.type !== TimeRangeAll.key) {
      const inputRangeFilter = this.createTabularInputRangeFilter(widget.customTimeRange, options.mainTimeRange);
      return this.composeInterceptor(instanceMeasureFilter, formulaInterceptor, measuresFilter, inputRangeFilter, sorter);
    }
    return this.composeInterceptor(instanceMeasureFilter, formulaInterceptor, measuresFilter, sorter);
  }

  private createLatestTableInterceptor(widget: TabularWidget, options: ConverterOptions): Interceptor {
    const instanceMeasureFilter = this.createCommonInterceptor(widget, options.globalFilters);
    const prevTimestamp = options.goBackTimeRange ? options.goBackTimeRange.endTimestamp : null;
    const latPrevFilter = this.createHistoricalFilter(prevTimestamp);
    const formulaInterceptor = this.createFormulaMeasuresInjector(widget.dataType, widget.measures);
    const measuresFilter = this.createMeasuresFilter(widget.dataType, widget.measures);
    return this.composeInterceptor(instanceMeasureFilter, latPrevFilter, formulaInterceptor, measuresFilter);
  }

  private createSankeyInterceptor(widget: SankeyWidget, options: ConverterOptions): Interceptor {
    const instanceFormatFilter = this.createInstanceFormatFilter(widget.dataType, /.+,.+/);
    const instanceMeasureFilter = this.createIdentifyInstanceInterceptor(widget, options.globalFilters);
    const timeFilter = options.goBackTimeRange
      ? this.createPastFilter(options.goBackTimeRange.endTimestamp)
      : this.createLatestFilter();
    return this.composeInterceptor(instanceFormatFilter, instanceMeasureFilter, timeFilter);
  }

  private createSolidGaugeInterceptor(widget: SolidGaugeWidget, options: ConverterOptions): Interceptor {
    const instancesMeasuresFilter = this.createCommonInterceptor(widget);
    const timeFilter = this.createCommonTimeFilter(widget, options);

    const formulaInterceptor = this.createFormulaMeasuresInjector(widget.dataType, widget.measures);
    const measuresFilter = this.createMeasuresFilter(widget.dataType, widget.measures);
    return this.composeInterceptor(instancesMeasuresFilter, timeFilter, formulaInterceptor, measuresFilter);
  }

  private createSunburstInterceptor(widget: SolidGaugeWidget, options: ConverterOptions): Interceptor {
    const instancesMeasuresFilter = this.createCommonInterceptor(widget, options.globalFilters);
    const timeFilter = this.createCommonTimeFilter(widget, options);
    const formulaInterceptor = this.createFormulaMeasuresInjector(widget.dataType, widget.measures);
    const measuresFilter = this.createMeasuresFilter(widget.dataType, widget.measures);
    return this.composeInterceptor(instancesMeasuresFilter, timeFilter, formulaInterceptor, measuresFilter);
  }

  private createGeoMapInterceptor(widget: GeoMapWidget, options: ConverterOptions): Interceptor {
    const instancesMeasuresFilter = this.createCommonInterceptor(widget, options.globalFilters);
    const timeFilter = this.createCommonTimeFilter(widget, options);
    const formulaInterceptor = this.createFormulaMeasuresInjector(widget.dataType, widget.measures);
    const measuresFilter = this.createMeasuresFilter(widget.dataType, widget.measures, widget.windows);
    return this.composeInterceptor(instancesMeasuresFilter, timeFilter, formulaInterceptor, measuresFilter);
  }

  private createCallTimeLineInterceptor(widget: CallTimeLineWidget, options: ConverterOptions): Interceptor {
    const measuresFilter = this.createMeasuresFilter(widget.dataType, widget.measures);
    const agentsFilter = this.createAgentsFilter(widget.agents);
    const queuesFilter = this.createQueuesFilter(widget.queues);
    const segmentTypesFilter = this.createSegmentTypesFilter(widget.segmentTypes);
    const sorter = this.createMeasureValueSorter('desc');
    return this.composeInterceptor(measuresFilter, agentsFilter, queuesFilter, segmentTypesFilter, sorter);
  }

  private createBubbleInterceptor(widget: BubbleWidget, options: ConverterOptions): Interceptor {
    const instancesMeasuresFilter = this.createCommonInterceptor(widget, options.globalFilters);
    const measuresFilter = this.createMeasuresFilter(widget.dataType, widget.measures, widget.windows);
    return this.composeInterceptor(instancesMeasuresFilter, measuresFilter);
  }

  private createBarGrouper(widget: BarWidget): Grouper {
    return widget.mode.value === WidgetMode.Instances
      ? this.createWindowMeasureGrouper()
      : widget.mode.value === WidgetMode.Measures
        ? this.createWindowInstanceGrouper()
        : this.createWindowInstanceMeasureGrouper(widget.timestamps);
  }

  private createLineGrouper(): Grouper {
    return this.createInstanceMeasureGrouper();
  }

  private createTrendDiffGrouper(widget: TrendDiffWidget, options: ConverterOptions): Grouper {
    const startTimestamp = this.getGoBackTimeRangeForTrendDiff(options).startTimestamp;
    const endTimestamp = this.getGoBackTimeRangeForTrendDiff(options).endTimestamp;
    return widget.trendType === TrendType.Day
      ? new DateGrouper(this._realTimeDataProcessor, startTimestamp, endTimestamp, widget.period, widget.numberOfLines, widget.timestamps)
      : new ShiftGrouper(this._realTimeDataProcessor, startTimestamp, endTimestamp, widget.period, widget.numberOfLines);
  }

  private createBillboardGrouper(): Grouper {
    return this.createInstanceTimestampGrouper();
  }

  private createLiquidFillGaugeGrouper(): Grouper {
    return this.createInstanceTimestampGrouper();
  }

  private createTabularGrouper(tabularWidget: TabularWidget): Grouper {
    return (tabularWidget.displayData === DataDisplayType.ShowInterval)
      ? this.createInstanceTimestampGrouper()
      : this.createInstanceGrouper();
  }

  private createSankeyGrouper(): Grouper {
    return this.createMeasureGrouper();
  }

  private createSolidGaugeGrouper(): Grouper {
    return this.createInstanceMeasureGrouper();
  }

  private createSunburstGrouper(): Grouper {
    return this.createMeasureGrouper();
  }

  private createGeoMapGrouper(): Grouper {
    return this.createMeasureGrouper();
  }

  private createCallTimeLineGrouper(groupBy: string): Grouper {
    switch (groupBy) {
      case CallTimeLineGroupBy.Agent:
        return new AgentGrouper(this._realTimeDataProcessor);
      case CallTimeLineGroupBy.Queue:
        return new QueueGrouper(this._realTimeDataProcessor);
      case CallTimeLineGroupBy.SegmentType:
        return new SegmentTypeGrouper(this._realTimeDataProcessor);
      case CallTimeLineGroupBy.CallId:
        return new CallIdGrouper(this._realTimeDataProcessor);
      default:
        return new AgentGrouper(this._realTimeDataProcessor);
    }
  }

  private createBubbleGrouper(): Grouper {
    return this.createInstanceMeasureGrouper();
  }

  private createBarBuilder(widget: BarWidget, options: ConverterOptions): ChartDataBuilder {
    return new HighchartsBarDataBuilder(widget, options.colorPalette, options.instanceColors);
  }

  private createLineBuilder(colorPalette: ColorPalette, instanceColors: InstanceColor[], widget: LineWidget): ChartDataBuilder {
    return new HighchartsLineDataBuilder(colorPalette, instanceColors, widget);
  }

  private createTrendDiffBuilder(widget: TrendDiffWidget, colorPalette: ColorPalette): ChartDataBuilder {
    return widget.trendType === TrendType.Day
      ? new HighchartsDayTrendDiffDataBuilder(colorPalette)
      : new HighchartsShiftTrendDiffDataBuilder(widget.period, colorPalette);
  }

  private createBillboardBuilder(colorPalette: ColorPalette): ChartDataBuilder {
    return new BillboardDataBuilder(colorPalette);
  }

  private createLiquidFillGaugeBuilder(colorPalette: ColorPalette): ChartDataBuilder {
    return new LiquidFillGaugeDataBuilder(colorPalette);
  }

  private createTabularBuilder(tabularWidget: TabularWidget, colorPalette: ColorPalette): ChartDataBuilder {
    return new TabularDataBuilder(tabularWidget, colorPalette);
  }

  private createSankeyBuilder(sankeyWidget: SankeyWidget, colorPalette: ColorPalette, instanceColors: InstanceColor[]): ChartDataBuilder {
    return new HighchartsSankeyDataBuilder(this.processor, sankeyWidget, colorPalette, instanceColors);
  }

  private createSolidGaugeBuilder(colorPalette: ColorPalette): ChartDataBuilder {
    return new SolidGaugeDataBuilder(colorPalette);
  }

  private createSunburstBuilder(colorPalette: ColorPalette, instanceColors: InstanceColor[]): ChartDataBuilder {
    return new SunburstDataBuilder(colorPalette, instanceColors);
  }

  private createGeoMapBuilder(widget: GeoMapWidget, colorPalette: ColorPalette, instanceColors: InstanceColor[]): ChartDataBuilder {
    return new GeoMapDataBuilder(widget, colorPalette, instanceColors);
  }

  private createCallTimeLineBuilder(widget: CallTimeLineWidget, colorPalette: ColorPalette): ChartDataBuilder {
    return new CallTimelineBuilder(widget, colorPalette);
  }

  private createBubbleBuilder(widget: BubbleWidget, colorPalette: ColorPalette): ChartDataBuilder {
    return new HighchartsBuubleDataBuilder(widget, colorPalette);
  }

  private createCommonInterceptor(widget: Widget, globalFilters: string[] = []): Interceptor {
    const instances = this.getDimesionInstances(widget, globalFilters);
    const measures = this._realTimeDataProcessor.getElementMeasures(widget.measures);
    if (widget.dimensions.length > 0 && widget.showAllData && globalFilters.length <= 0) {
      return this.createMeasuresFilter(widget.dataType, measures, widget.windows);
    } else {
      return this.createInstancesMeasuresFilter(widget.dataType, instances, measures, widget.windows);
    }
  }

  private createInstanceFormatFilter(dataType: string, instanceFormat: RegExp) {
    return new InstanceFormatFilter(dataType, instanceFormat, this._realTimeDataProcessor);
  }

  private createIdentifyInstanceInterceptor(widget: Widget, globalFilters: string[] = []): Interceptor {
    const instances = this.getDimesionInstances(widget, globalFilters);
    const measures = this._realTimeDataProcessor.getElementMeasures(widget.measures);
    let sankeyInstances = [];
    widget.dimensions.forEach(dimension => sankeyInstances = [...sankeyInstances, ...unionInstances(dimension)]);
    if (sankeyInstances.length === 0 && widget.showAllData && globalFilters.length <= 0) {
      return this.createMeasuresFilter(widget.dataType, measures, widget.windows);
    } else {
      return this.createIdentifyInstancesFilter(widget.dataType, instances, measures, widget);
    }
  }

  private createMeasuresFilter(dataType: string, measures: string[], windows?: string[]): Interceptor {
    return new MeasureFilter(dataType, measures, windows, this._realTimeDataProcessor);
  }

  private createAgentsFilter(agents: string[]): Interceptor {
    return new AgentFilter(agents, this._realTimeDataProcessor);
  }

  private createQueuesFilter(queues: string[]): Interceptor {
    return new QueueFilter(queues, this._realTimeDataProcessor);
  }

  private createSegmentTypesFilter(segmentTypes: string[]): Interceptor {
    return new SegmentTypeFilter(segmentTypes, this._realTimeDataProcessor);
  }

  private createFormulaMeasuresInjector(dataType: string, measures: string[]): Interceptor {
    return new FormulaMeasureInjector(this._realTimeDataProcessor, dataType, measures);
  }

  private createInstancesMeasuresFilter(dataType: string, instances: any, measures: string[], windows: string[]): Interceptor {
    return new KeyMeasureFilter(dataType, instances, measures, windows, this._realTimeDataProcessor);
  }

  private createIdentifyInstancesFilter(dataType: string, instances: any, measures: string[], widget: Widget): Interceptor {
    return new KeyMeasureFilter(dataType, instances, measures, widget.windows, this._realTimeDataProcessor, widget);
  }

  private createTimestampNormalizer(interval: TimeRangeInterval, timestamps: number[]): Interceptor {
    return new TimestampNormalizer(this._realTimeDataProcessor, interval, timestamps);
  }

  private createLatestFilter(): Interceptor {
    return new LatestFilter(this._realTimeDataProcessor);
  }

  private createPastFilter(timestamp: number): Interceptor {
    return new PreviousFilter(timestamp, this.processor);
  }

  private createTimestampFilter(timestamp: number): Interceptor {
    return new TimestampFilter(timestamp, this.processor);
  }

  private createHistoricalFilter(timestamp: number, historicalTimeStamp?: number, realTimeMode?: boolean): Interceptor {
    return new LatestPreviousFilter(timestamp, historicalTimeStamp, realTimeMode, this._realTimeDataProcessor);
  }

  private createHistoricalTimestampFilter(timestamp: number, historicalTimeStamp?: number, realTimeMode?: boolean): Interceptor {
    return new LatestPreviousTimestampFilter(timestamp, historicalTimeStamp, realTimeMode, this._realTimeDataProcessor);
  }

  private createInputRangeFilter(mode: BarMode, timeRange: TimeRange, historicalTimeStamp: number[]): Interceptor {
    if (mode.value === WidgetMode.TimeRange) {
      if (!mode.timeGroup) {
        return null;
      }
      const {type, interval, range} = mode.timeGroup;
      if (!interval || !interval.value || !interval.unit) {
        return null;
      }
      const {startTimestamp, endTimestamp} = this.getInputRange(type, type === TimeGroupBy.CustomRange ? range : timeRange);
      return new InputRangeIntervalFilter({startTimestamp, endTimestamp}, interval, historicalTimeStamp, this._realTimeDataProcessor);
    }
    return null;
  }

  private createTabularInputRangeFilter(customTimeRange: TimeGroup, timeRange: TimeRange): Interceptor {
    const {type, range} = customTimeRange;

    const {startTimestamp, endTimestamp} = type !== TimeGroupBy.CustomRange ?
      this.getInputRange(customTimeRange.type, timeRange) :
      this.getInputRange(customTimeRange.type, range);
    return new InputRangeFilter({startTimestamp, endTimestamp}, this._realTimeDataProcessor);
  }

  private createKpiFilter(hideKPI: KpiThresholds): Interceptor {
    return new KpiFilter(hideKPI, this._realTimeDataProcessor);
  }

  private createTimestampSorter(): Interceptor {
    return new TimestampSorter();
  }

  private createTrendDiffTimeFilter(timestamps: number[]): Interceptor {
    return new TrendDiffTimeFilter(timestamps, this._realTimeDataProcessor);
  }

  private createInstanceTimestampSorter(): Interceptor {
    return new InstanceTimestampSorter('asc', 'desc');
  }

  private createMeasureValueSorter(order = 'asc'): Interceptor {
    return new MeasureValueSorter(order);
  }

  private createDefaultInterceptor(): Interceptor {
    return new DefaultInterceptor();
  }

  private composeInterceptor(...interceptors: Interceptor[]): Interceptor {
    return new CompositeInterceptor(...interceptors);
  }

  private createInstanceGrouper(): Grouper {
    return new InstanceGrouper(this._realTimeDataProcessor);
  }

  private createMeasureGrouper(): Grouper {
    return new MeasureGrouper(this._realTimeDataProcessor);
  }

  private createWindowInstanceGrouper(): Grouper {
    return new WindowInstanceGrouper(this._realTimeDataProcessor);
  }

  private createWindowMeasureGrouper(): Grouper {
    return new WindowMeasureGrouper(this._realTimeDataProcessor);
  }

  private createInstanceMeasureGrouper(timestamps: number[] = null): Grouper {
    return new InstanceMeasureGrouper(this._realTimeDataProcessor);
  }

  private createWindowInstanceMeasureGrouper(timestamps: number[] = null): Grouper {
    return new WindowInstanceMeasureGrouper(this._realTimeDataProcessor);
  }

  private createInstanceTimestampGrouper(): Grouper {
    return new InstanceTimestampGrouper(this._realTimeDataProcessor);
  }

  private createMeasureTimestampGrouper(): Grouper {
    return new MeasureTimestampGrouper(this._realTimeDataProcessor);
  }

  private getGoBackTimeRangeForTrendDiff(options: ConverterOptions): TimeRange {
    return options.goBackTimeRange || options.mainTimeRange;
  }

  private getDimesionInstances(widget, globalFilters: string[]) {
    if (widget.type === WidgetType.Tabular) {
      const tabular = widget as TabularWidget;
      const keyColumns = tabular.columns.filter(column => column.type === 'string' && column.id !== Key);
      let tabularInstances = {};
      if (tabular.dimensions && tabular.dimensions.length > 0) {
        tabularInstances = this.getWidgetInstances(widget, globalFilters);
      }
      if (keyColumns.length === 0) {
        return tabularInstances;
      }

      return Object.keys(tabularInstances).reduce((acc, item) => {
        acc[item] = tabularInstances[item].filter(instance => instance.split(',').length === keyColumns.length);
        return acc;
      }, {});
    } else {
      return this.getWidgetInstances(widget, globalFilters);
    }
  }

  private getWidgetInstances(widget: Widget, globalFilters: string[]) {
    return widget.dimensions.reduce((acc, item) => {
      acc[item.dimension] = _.union(_.union(item.systemInstances, item.customInstances), globalFilters);
      return acc;
    }, {});
  }

  private getInputRange(type: string, timeRange) {
    let startTimeRange = null;
    let endTimeRange = null;
    if (timeRange && timeRange.startTimestamp && timeRange.endTimestamp) {
      endTimeRange = timeRange.endTimestamp;
      startTimeRange = timeRange.startTimestamp;
    } else {
      endTimeRange = timeRange && timeRange.endDay ? timeRange.endDay : +getCurrentMoment().startOf('second');
      startTimeRange = timeRange && timeRange.startDay ? timeRange.startDay : +getCurrentMoment().startOf('day');
    }
    return this._timeUtils.getTimeRange(type, {startTimeRange, endTimeRange});
  }

  private createCommonTimeFilter(widget, options) {
    switch (widget.displayMode) {
      case (DisplayMode.Historical): {
        return options.goBackTimeRange
          ? this.createPastFilter(options.goBackTimeRange.endTimestamp)
          : this.createLatestFilter();
      }
      case (DisplayMode.Timestamp): {
        return (widget.timestamps && widget.timestamps.length > 0 && widget.timestamps[0])
          ? this.createTimestampFilter(widget.timestamps[0])
          : this.createLatestFilter();
      }
      default: {
        return this.createLatestFilter();
      }
    }
  }
}

@Injectable()
export class HighchartsDataConverterFactory extends AbstractDataConverterFactory {
  constructor(@Inject(REAL_TIME_DATA_PROCESSOR) realTimeDataProcessor: RealTimeDataProcessor,
              @Inject(TIME_UTILS) timeUtils) {
    super(realTimeDataProcessor, timeUtils);
  }
}
