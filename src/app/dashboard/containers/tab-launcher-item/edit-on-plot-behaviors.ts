import {Store} from '@ngrx/store';
import {DataTypes} from '../../../measures/models/enums';
import {CallTimeLineWidget, Widget} from '../../../widgets/models';
import * as editOnPlotActions from '../../actions/edit-on-plot.actions';
import {MetricValueGetter, PlotPoint, UpdateMetricsOptions, UpdateMetricsSideEffects} from '../../models';
import * as fromDashboards from '../../reducers';
import {EditOnPlotValidator} from './edit-on-plot-validator';
import {Draggable, DragOption, Metric, Strategy} from '../../models/enums';
import {WidgetMode, WidgetType} from '../../../widgets/constants/widget-types';
import {isNullOrUndefined} from 'util';
import {unionDimensions} from '../../../common/utils/function';

export interface EditOnPlotBehavior {
  edit(options?: any);
}

export class DoNotEditOnPlot implements EditOnPlotBehavior {
  edit(options?: any) {
    // no op
  }
}

export class OptionsBuilder {
  private _metric: string;
  private _options: UpdateMetricsOptions = {};

  get options(): { [metric: string]: UpdateMetricsOptions } {
    return {[this._metric]: this._options};
  }

  static getTargetProp(metric: string): string {
    if (metric.endsWith('s')) {
      return metric;
    }
    return `${metric}s`;
  }

  from(metric: string, valueGetter?: MetricValueGetter): OptionsBuilder {
    this._metric = metric;
    this._options.valueGetter = valueGetter;
    return this;
  }

  fromDimension(valueGetter?: MetricValueGetter): OptionsBuilder {
    return this.from(Metric.DIMENSION, valueGetter);
  }

  fromInstance(valueGetter?: MetricValueGetter): OptionsBuilder {
    return this.from(Metric.INSTANCE, valueGetter);
  }

  fromInstances(valueGetter?: MetricValueGetter): OptionsBuilder {
    return this.from(Metric.INSTANCES, valueGetter);
  }

  fromMeasure(valueGetter?: MetricValueGetter): OptionsBuilder {
    return this.from(Metric.MEASURE, valueGetter);
  }

  fromMeasures(valueGetter?: MetricValueGetter): OptionsBuilder {
    return this.from(Metric.MEASURES, valueGetter);
  }

  fromAgent(valueGetter?: MetricValueGetter): OptionsBuilder {
    return this.from(Metric.AGENT, valueGetter);
  }

  fromQueue(valueGetter?: MetricValueGetter): OptionsBuilder {
    return this.from(Metric.QUEUE, valueGetter);
  }

  fromSegmentType(valueGetter?: MetricValueGetter): OptionsBuilder {
    return this.from(Metric.SEGMENT_TYPE, valueGetter);
  }

  fromNode(valueGetter?: MetricValueGetter): OptionsBuilder {
    return this.from(Metric.NODE, valueGetter);
  }

  fromTimestamp(valueGetter?: MetricValueGetter): OptionsBuilder {
    return this.from(Metric.TIMESTAMP, valueGetter);
  }

  fromTimestamps(valueGetter?: MetricValueGetter): OptionsBuilder {
    return this.from(Metric.TIMESTAMPS, valueGetter);
  }

  fromWindow(valueGetter?: MetricValueGetter): OptionsBuilder {
    return this.from(Metric.WINDOW, valueGetter);
  }

  to(metric: any, validatorFn?): OptionsBuilder {
    this._options.targetProp = typeof metric === 'function' ? metric : OptionsBuilder.getTargetProp(metric);
    this._options.validatorFn = validatorFn;
    return this;
  }

  toDimension(validatorFn?): OptionsBuilder {
    return this.to(Metric.DIMENSION, validatorFn || EditOnPlotValidator.dropInstanceValidator());
  }

  toInstance(validatorFn?): OptionsBuilder {
    return this.to(Metric.INSTANCE, validatorFn || EditOnPlotValidator.dropInstanceValidator());
  }

  toMeasure(validatorFn?): OptionsBuilder {
    return this.to(Metric.MEASURE, validatorFn || EditOnPlotValidator.dropMeasureValidator());
  }

  toAgent(validatorFn?): OptionsBuilder {
    return this.to(Metric.AGENT, validatorFn);
  }

  toQueue(validatorFn?): OptionsBuilder {
    return this.to(Metric.QUEUE, validatorFn);
  }

  toSegmentType(validatorFn?): OptionsBuilder {
    return this.to(Metric.SEGMENT_TYPE, validatorFn || EditOnPlotValidator.dropMeasureValidator());
  }

  toTimestamp(validatorFn?): OptionsBuilder {
    return this.to(Metric.TIMESTAMP, validatorFn || EditOnPlotValidator.dropMeasureValidator());
  }

  toTimestamps(validatorFn?): OptionsBuilder {
    return this.to(Metric.TIMESTAMPS, validatorFn || EditOnPlotValidator.dropMeasureValidator());
  }

  toWindow(validatorFn?): OptionsBuilder {
    return this.to(Metric.WINDOW, validatorFn || EditOnPlotValidator.dropMeasureValidator());
  }

  do(strategy): OptionsBuilder {
    this._options.strategy = strategy;
    return this;
  }

  add(): OptionsBuilder {
    return this.do(Strategy.ADD);
  }

  adds(): OptionsBuilder {
    return this.do(Strategy.ADDS);
  }

  replace(): OptionsBuilder {
    return this.do(Strategy.REPLACE);
  }

  edit(): OptionsBuilder {
    return this.do(Strategy.EDIT);
  }

  remove(): OptionsBuilder {
    return this.do(Strategy.DELETE);
  }

  withEffects(effects: UpdateMetricsSideEffects): OptionsBuilder {
    this._options.sideEffects = effects;
    return this;
  }
}

export abstract class CanEdit implements EditOnPlotBehavior {
  private _store: Store<fromDashboards.State>;
  private _widget: Widget;

  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    this._store = store;
    this._widget = widget;
  }

  get store(): Store<fromDashboards.State> {
    return this._store;
  }

  get widget(): Widget {
    return this._widget;
  }

  abstract configure(options: any): OptionsBuilder | OptionsBuilder[];

  edit(options: any) {
    const builder = this.configure(options);
    if (builder) {
      this.store.dispatch(new editOnPlotActions.UpdateMetrics({
        widgetId: this.widget.id,
        confirmation: this.getConfirmation(),
        ...this.extractOptions(builder),
      }));
    }
  }

  getConfirmation() {
    return null;
  }

  extractOptions(builder: OptionsBuilder | OptionsBuilder[]) {
    if (Array.isArray(builder)) {
      return builder.reduce((acc, current: OptionsBuilder) => {
        return {...acc, ...current.options};
      }, {});
    } else {
      return builder.options;
    }
  }

  builder(): OptionsBuilder {
    return new OptionsBuilder();
  }
}

export abstract class CanDrop extends CanEdit {
  static getStrategyByChoice(strategy: string, expected: string) {
    return (srcWidget: Widget, targetWidget: Widget, value: string, confirmation: string) => {
      return !confirmation || confirmation === expected ? strategy : null;
    };
  }

  abstract configureInstance(): OptionsBuilder;

  abstract configureMeasure(): OptionsBuilder;

  abstract configureAll(): OptionsBuilder[];

  configure(draggable: Draggable) {
    if (draggable === Draggable.Instance) {
      return this.configureInstance();
    } else if (draggable === Draggable.Measure) {
      return this.configureMeasure();
    } else if (draggable === Draggable.Both) {
      return this.configureAll();
    }
    return null;
  }
}

export abstract class DropOnBasicWidget extends CanDrop {
  static getCallTimelineInstanceStrategy(strategy: string) {
    return CanDrop.getStrategyByChoice(strategy, DropOnBasicWidget.getDialogOptions().choices[1]);
  }

  static getSegmentTypeStrategy(strategy: string) {
    return CanDrop.getStrategyByChoice(strategy, DropOnBasicWidget.getDialogOptions().choices[0]);
  }

  static getDialogOptions(): { message: string, choices: string[] } {
    return {
      message: 'Which metric do you want to add?',
      choices: ['measure', 'instance']
    };
  }

  protected dimension(): OptionsBuilder {
    return this.builder().fromDimension().add().toDimension();
  }

  protected window(): OptionsBuilder {
    return this.builder().fromWindow().add().toWindow();
  }

  timestamp(isAppend: boolean): OptionsBuilder {
    if (isAppend) {
      return this.builder().fromTimestamp().add().toTimestamp();
    }
    return this.builder().fromTimestamp().replace().toTimestamp();
  }

  timestamps(): OptionsBuilder {
    return this.builder().fromTimestamps().adds().toTimestamps();
  }

  getConfirmation() {
    return (srcWidget: Widget, targetWidget: Widget, point: PlotPoint) => {
      if (!srcWidget || srcWidget.type !== WidgetType.CallTimeLine) {
        return null;
      }

      const metric = targetWidget.dataType === (DataTypes.QUEUE_STATUS || DataTypes.QUEUE_PERFORMANCE) ? Metric.QUEUE : Metric.AGENT;
      return !targetWidget.measures.includes(point.segmentType) && !unionDimensions(targetWidget).includes(point[metric])
        ? DropOnLine.getDialogOptions()
        : null;
    };
  }
}

export abstract class DropOnOptionWidget extends DropOnBasicWidget {
  executeEdit(options: any, optionsGetter: any) {
    if (options !== Draggable.Both) {
      return super.edit(options);
    }
    const builder = this.configure(options);
    if (builder) {
      const payload = {
        metrics: {
          widgetId: this.widget.id,
          confirmation: this.getConfirmation(),
          ...this.extractOptions(builder)
        },
        optionsGetter: optionsGetter
      };
      this.store.dispatch(new editOnPlotActions.DropTimeStampDialog(payload));
    }
  }

  protected instances(): OptionsBuilder {
    return this.builder().fromInstance().adds().toInstance();
  }

  protected measures(): OptionsBuilder {
    return this.builder().fromMeasure().adds().toMeasure();
  }
}

export class DropOnLine extends DropOnOptionWidget {
  configureInstance(): OptionsBuilder {
    return this.instance();
  }

  configureMeasure(): OptionsBuilder {
    return this.measure();
  }

  configureAll(): OptionsBuilder[] {
    return [this.dimension(), this.instance(), this.measure(), this.agent(), this.queue(), this.segmentType(), this.window()];
  }

  edit(options: any) {
    super.executeEdit(options, (optionSelections: string[], isGroup: boolean) =>
      this.configureOptions(optionSelections, isGroup));
  }

  private configureOptions(options: string[], isGroup: boolean): any {
    const builder = [];
    if (options) {
      options.forEach(option => {
        if (option === DragOption.AddInstance) {
          builder.push(isGroup ? this.instances() : this.instance());
        } else if (option === DragOption.AddMeasure) {
          builder.push(isGroup ? this.measures() : this.measure());
        } else if (option === DragOption.AddTimestamp) {
          builder.push(isGroup ? this.timestamps() : this.timestamp(true));
        }
      });
    }
    return this.extractOptions(builder);
  }

  private instance(): OptionsBuilder {
    return this.builder().fromInstance().add().toInstance();
  }

  private measure(): OptionsBuilder {
    return this.builder().fromMeasure().add().toMeasure();
  }

  private agent(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.ADD);
    return this.builder().fromAgent().do(strategy).toInstance();
  }

  private queue(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.ADD);
    return this.builder().fromQueue().do(strategy).toInstance();
  }

  private segmentType(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getSegmentTypeStrategy(Strategy.ADD);
    return this.builder().fromSegmentType().do(strategy).toMeasure();
  }
}

export class DropOnBar extends DropOnOptionWidget {
  configureInstance(): OptionsBuilder {
    return this.instance();
  }

  configureMeasure(): OptionsBuilder {
    return this.measure();
  }

  configureAll(): OptionsBuilder[] {
    return [this.dimension(), this.instance(), this.agent(), this.queue(), this.segmentType(), this.window()];
  }

  edit(options: any) {
    super.executeEdit(options, (optionSelections: string[], mode: string, isGroup: boolean) =>
      this.configureOptions(optionSelections, mode, isGroup));
  }

  private configureOptions(options: string[], mode: string, isGroup: boolean): any {
    const builder = [];
    if (options) {
      options.forEach(option => {
        if (option === DragOption.AddInstance) {
          builder.push(isGroup ? this.instances() : this.instance());
        } else if (option === DragOption.AddMeasure) {
          builder.push(isGroup ? this.measures() : this.measure());
        } else if (option === DragOption.AddTimestamp) {
          builder.push(isGroup ? this.timestamps() : this.timestamp(mode === WidgetMode.TimeRange));
        }
      });
    }
    return this.extractOptions(builder);
  }

  private instance(): OptionsBuilder {
    return this.builder().fromInstance().add().toInstance();
  }

  private measure(): OptionsBuilder {
    return this.builder().fromMeasure().add().toMeasure().withEffects({updateMeasureRelationship: true});
  }

  protected measures(): OptionsBuilder {
    return this.builder().fromMeasure().adds().toMeasure().withEffects({updateMeasureRelationship: true});
  }

  private agent(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.ADD);
    return this.builder().fromAgent().do(strategy).toInstance();
  }

  private queue(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.ADD);
    return this.builder().fromQueue().do(strategy).toInstance();
  }

  private segmentType(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getSegmentTypeStrategy(Strategy.ADD);
    return this.builder().fromSegmentType().do(strategy).toMeasure();
  }
}

export class DropOnTable extends DropOnBasicWidget {
  configureInstance(): OptionsBuilder {
    return this.instance();
  }

  configureMeasure(): OptionsBuilder {
    return this.measure();
  }

  configureAll(): OptionsBuilder[] {
    return [this.dimension(), this.instance(), this.agent(), this.queue(), this.segmentType(), this.window()];
  }

  private instance(): OptionsBuilder {
    return this.builder().fromInstance().add().toInstance();
  }

  private measure(): OptionsBuilder {
    return this.builder().fromMeasure().add().toMeasure().withEffects({updateMeasureRelationship: true, addColumn: true});
  }

  private agent(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.ADD);
    return this.builder().fromAgent().do(strategy).toInstance();
  }

  private queue(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.ADD);
    return this.builder().fromQueue().do(strategy).toInstance();
  }

  private segmentType(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getSegmentTypeStrategy(Strategy.ADD);
    return this.builder().fromSegmentType().do(strategy).toMeasure().withEffects({addColumn: true});
  }
}

export class DropOnTrendDiff extends DropOnBasicWidget {
  configureInstance(): OptionsBuilder {
    return this.instance();
  }

  configureMeasure(): OptionsBuilder {
    return this.measure({updateSubTitle: false});
  }

  configureAll(): OptionsBuilder[] {
    return [this.dimension(), this.instance(), this.measure(), this.agent(), this.queue(), this.segmentType(), this.window(), this.timestamp(true)];
  }

  private instance(): OptionsBuilder {
    return this.builder().fromInstance().replace().toInstance().withEffects({updateSubTitle: false});
  }

  private measure(effects: UpdateMetricsSideEffects = null): OptionsBuilder {
    return this.builder().fromMeasure().replace().toMeasure().withEffects(effects);
  }

  private agent(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.REPLACE);
    return this.builder().fromAgent().do(strategy).toInstance();
  }

  private queue(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.REPLACE);
    return this.builder().fromQueue().do(strategy).toInstance();
  }

  private segmentType(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getSegmentTypeStrategy(Strategy.REPLACE);
    return this.builder().fromSegmentType().do(strategy).toMeasure();
  }
}

export abstract class DropOnSingleInstanceWidget extends DropOnBasicWidget {
  edit(options: any) {
    if (options !== Draggable.Both) {
      return super.edit(options);
    }
    const builder = this.configure(options);
    if (builder) {
      const payload = {
        metrics: {
          widgetId: this.widget.id,
          confirmation: this.getConfirmation(),
          ...this.extractOptions(builder)
        },
        timestamp: this.extractOptions(this.timestamp(false))
      };
      this.store.dispatch(new editOnPlotActions.DropTimeStamp(payload));
    }
  }
}

export class DropOnBillboard extends DropOnSingleInstanceWidget {
  configureInstance(): OptionsBuilder {
    return this.instance();
  }

  configureMeasure(): OptionsBuilder {
    return this.measure();
  }

  configureAll(): OptionsBuilder[] {
    return [this.dimension(), this.instance(), this.agent(), this.queue(), this.segmentType(), this.window()];
  }

  private instance(): OptionsBuilder {
    return this.builder().fromInstance().replace().toInstance().withEffects({updateSubTitle: false});
  }

  private measure(): OptionsBuilder {
    return this.builder().fromMeasure().replace().toMeasure().withEffects({updateSubTitle: false});
  }

  private agent(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.REPLACE);
    return this.builder().fromAgent().do(strategy).toInstance();
  }

  private queue(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.REPLACE);
    return this.builder().fromQueue().do(strategy).toInstance();
  }

  private segmentType(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getSegmentTypeStrategy(Strategy.REPLACE);
    return this.builder().fromSegmentType().do(strategy).toMeasure();
  }
}

export class DropOnLiquidFillGauge extends DropOnSingleInstanceWidget {
  configureInstance(): OptionsBuilder {
    return this.instance();
  }

  configureMeasure(): OptionsBuilder {
    return this.measure();
  }

  configureAll(): OptionsBuilder[] {
    return [this.dimension(), this.instance(), this.agent(), this.queue(), this.segmentType(), this.window()];
  }

  private instance(): OptionsBuilder {
    return this.builder().fromInstance().replace().toInstance().withEffects({updateSubTitle: false});
  }

  private measure(): OptionsBuilder {
    return this.builder().fromMeasure().replace().toMeasure().withEffects({updateSubTitle: false});
  }

  private agent(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.REPLACE);
    return this.builder().fromAgent().do(strategy).toInstance();
  }

  private queue(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.REPLACE);
    return this.builder().fromQueue().do(strategy).toInstance();
  }

  private segmentType(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getSegmentTypeStrategy(Strategy.REPLACE);
    return this.builder().fromSegmentType().do(strategy).toMeasure();
  }
}

export class DropOnSolidGauge extends DropOnSingleInstanceWidget {
  configureInstance(): OptionsBuilder {
    return this.instance();
  }

  configureMeasure(): OptionsBuilder {
    return this.measure();
  }

  configureAll(): OptionsBuilder[] {
    return [this.dimension(), this.instance(), this.agent(), this.queue(), this.segmentType(), this.window()];
  }

  private instance(): OptionsBuilder {
    return this.builder().fromInstance().replace().toInstance().withEffects({updateSubTitle: false});
  }

  private measure(): OptionsBuilder {
    return this.builder().fromMeasure().replace().toMeasure().withEffects({updateSubTitle: false});
  }

  private agent(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.REPLACE);
    return this.builder().fromAgent().do(strategy).toInstance();
  }

  private queue(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.REPLACE);
    return this.builder().fromQueue().do(strategy).toInstance();
  }

  private segmentType(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getSegmentTypeStrategy(Strategy.REPLACE);
    return this.builder().fromSegmentType().do(strategy).toMeasure();
  }
}

export class DropOnGeoMap extends DropOnBasicWidget {
  configureInstance(): OptionsBuilder {
    return this.instance();
  }

  configureMeasure(): OptionsBuilder {
    return this.measure();
  }

  configureAll(): OptionsBuilder[] {
    return [this.dimension(), this.instance(), this.agent(), this.queue(), this.segmentType(), this.timestamp(false), this.window()];
  }

  private instance(): OptionsBuilder {
    return this.builder().fromInstance().add().toInstance().withEffects({updateSubTitle: false});
  }

  private measure(): OptionsBuilder {
    return this.builder().fromMeasure().replace().toMeasure().withEffects({updateSubTitle: false});
  }

  private agent(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.ADD);
    return this.builder().fromAgent().do(strategy).toInstance();
  }

  private queue(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.ADD);
    return this.builder().fromQueue().do(strategy).toInstance();
  }

  private segmentType(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getSegmentTypeStrategy(Strategy.REPLACE);
    return this.builder().fromSegmentType().do(strategy).toMeasure();
  }
}

export class DropOnSunburst extends DropOnBasicWidget {
  configureInstance(): OptionsBuilder {
    return this.instance();
  }

  configureMeasure(): OptionsBuilder {
    return this.measure();
  }

  configureAll(): OptionsBuilder[] {
    return [this.dimension(), this.instance(), this.agent(), this.queue(), this.segmentType(), this.timestamp(false), this.window()];
  }

  private instance(): OptionsBuilder {
    const validatorFn = this.getValidatorFn();
    return this.builder().fromInstance().add().toInstance(validatorFn).withEffects({updateSubTitle: false});
  }

  private measure(): OptionsBuilder {
    return this.builder().fromMeasure().replace().toMeasure().withEffects({updateSubTitle: false});
  }

  private agent(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.ADD);
    const validatorFn = this.getValidatorFn();
    return this.builder().fromAgent().do(strategy).toInstance(validatorFn);
  }

  private queue(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getCallTimelineInstanceStrategy(Strategy.ADD);
    const validatorFn = this.getValidatorFn();
    return this.builder().fromQueue().do(strategy).toInstance(validatorFn);
  }

  private segmentType(): OptionsBuilder {
    const strategy = DropOnBasicWidget.getSegmentTypeStrategy(Strategy.ADD);
    return this.builder().fromSegmentType().do(strategy).toMeasure();
  }

  private getValidatorFn() {
    return EditOnPlotValidator.compose(EditOnPlotValidator.dropInstanceValidator(), EditOnPlotValidator.validateInstanceLevel);
  }
}

export class DropOnSankey extends DropOnBasicWidget {
  configureInstance(): OptionsBuilder {
    return this.instance();
  }

  configureMeasure(): OptionsBuilder {
    return this.measure();
  }

  configureAll(): OptionsBuilder[] {
    return [this.dimension(), this.instance(), this.timestamp(false), this.window()];
  }

  private instance(): OptionsBuilder {
    return this.builder().fromInstance().add().toInstance().withEffects({updateSubTitle: false});
  }

  private measure(): OptionsBuilder {
    return this.builder().fromMeasure().add().toMeasure().withEffects({updateSubTitle: false});
  }
}

export class DropOnCallTimeline extends CanDrop {
  static hasSegmentType(widget: CallTimeLineWidget, segmentType: string): boolean {
    return widget.segmentTypes.includes(segmentType);
  }

  static hasAgent(widget: CallTimeLineWidget, agent: string): boolean {
    return widget.agents.includes(agent);
  }

  static hasQueue(widget: CallTimeLineWidget, queue: string): boolean {
    return widget.queues.includes(queue);
  }

  static getMeasureStrategy() {
    return (srcWidget: Widget, targetWidget: Widget, measure: string) => {
      return measure.startsWith('CallTimeLine') ? Strategy.REPLACE : Strategy.ADD;
    };
  }

  static getCallTimelineInstanceStrategy(strategy: string) {
    return CanDrop.getStrategyByChoice(strategy, DropOnCallTimeline.getDialogOptions().choices[1]);
  }

  static getSegmentTypeStrategy(strategy: string) {
    return CanDrop.getStrategyByChoice(strategy, DropOnCallTimeline.getDialogOptions().choices[0]);
  }

  static getDialogOptions(): { message: string, choices: string[] } {
    return {
      message: 'Which metric do you want to add?',
      choices: ['segmentType', 'agent/queue']
    };
  }

  static getMeasureTarget() {
    return (srcWidget: Widget, targetWidget: Widget, measure: string) => {
      return measure.startsWith('CallTimeLine')
        ? OptionsBuilder.getTargetProp(Metric.MEASURE)
        : OptionsBuilder.getTargetProp(Metric.SEGMENT_TYPE);
    };
  }

  getConfirmation() {
    return (srcWidget: Widget, targetWidget: CallTimeLineWidget, point: PlotPoint) => {
      const checkSegmentType = !isNullOrUndefined(point.segmentType) && !DropOnCallTimeline.hasSegmentType(targetWidget, point.segmentType);
      const checkAgent = !isNullOrUndefined(point.agent) && !DropOnCallTimeline.hasAgent(targetWidget, point.agent);
      const checkQueue = !isNullOrUndefined(point.queue) && !DropOnCallTimeline.hasQueue(targetWidget, point.queue);
      return checkSegmentType && (checkAgent || checkQueue) ? DropOnCallTimeline.getDialogOptions() : null;
    };
  }

  configureInstance(): OptionsBuilder {
    return this.instance();
  }

  configureMeasure(): OptionsBuilder {
    return this.measure();
  }

  configureAll(): OptionsBuilder[] {
    return [this.instance(), this.agent(), this.queue(), this.segmentType(), this.node()];
  }

  private instance(): OptionsBuilder {
    return this.builder().fromInstance().add().to(this.getInstanceTargetProp());
  }

  private measure(): OptionsBuilder {
    const strategy = DropOnCallTimeline.getMeasureStrategy();
    const target = DropOnCallTimeline.getMeasureTarget();
    const validatorFn = EditOnPlotValidator.dropMeasureValidator();
    return this.builder().fromMeasure().do(strategy).to(target, validatorFn);
  }

  private agent(): OptionsBuilder {
    const strategy = DropOnCallTimeline.getCallTimelineInstanceStrategy(Strategy.ADD);
    return this.builder().fromAgent().do(strategy).toAgent();
  }

  private queue(): OptionsBuilder {
    const strategy = DropOnCallTimeline.getCallTimelineInstanceStrategy(Strategy.ADD);
    return this.builder().fromQueue().do(strategy).toQueue();
  }

  private segmentType(): OptionsBuilder {
    const strategy = DropOnCallTimeline.getSegmentTypeStrategy(Strategy.ADD);
    return this.builder().fromSegmentType().do(strategy).toSegmentType();
  }

  private node(): OptionsBuilder {
    return this.builder().fromNode().add().to(this.getInstanceTargetProp());
  }

  private getInstanceTargetProp() {
    return (srcWidget: Widget) => {
      if (!srcWidget) {
        return null;
      }
      if (srcWidget.type === WidgetType.Sunburst || srcWidget.type === WidgetType.Sankey) {
        return [OptionsBuilder.getTargetProp(Metric.AGENT), OptionsBuilder.getTargetProp(Metric.QUEUE)];
      }
      return srcWidget.dataType === (DataTypes.QUEUE_PERFORMANCE || DataTypes.QUEUE_STATUS)
        ? OptionsBuilder.getTargetProp(Metric.QUEUE)
        : OptionsBuilder.getTargetProp(Metric.AGENT);
    };
  }
}

export class DeleteMetricBehavior extends CanEdit {
  configure(metric: string) {
    return this.builder().from(metric).remove().to(metric);
  }
}

export class DeleteTableMetricBehavior extends CanEdit {
  configure(metric: string) {
    const effects = metric === Metric.MEASURE ? {deleteColumn: true} : null;
    return this.builder().from(metric).remove().to(metric).withEffects(effects);
  }
}
