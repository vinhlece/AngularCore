import {EditWidgetFormOptions} from '../../forms/edit-widget-form/edit-widget-form.component';
import {
  BarWidget, BillboardWidget, CallTimeLineWidget, GeoMapWidget, LineWidget, SankeyWidget, SolidGaugeWidget,
  SunburstWidget, TabularWidget,
  TrendDiffWidget,
  Widget,
  LiquidFillGaugeWidget} from '../../../models/index';
import {DataDisplayType, EditWidgetType, WidgetSection} from '../../../models/enums';
import {BarStyleDivider} from '../../../constants/constants';
import {isNullOrUndefined} from 'util';
import {unionInstances, validateFunc} from '../../../../common/utils/function';
import * as _ from 'lodash';
import {FlexibleChoicePackage} from '../../forms/flexible-choice-input/flexible-choice-package';
import { DataModeLocale } from '../../../models/constants';
import { WidgetMode } from '../../../constants/widget-types';


export abstract class AbstractFormOptions {
  protected _editType: EditWidgetType;

  constructor(editType: EditWidgetType) {
    this._editType = editType;
  }

  protected abstract getAllOptions(widget: Widget, options: any): EditWidgetFormOptions;

  create(widget: Widget, options: any): EditWidgetFormOptions {
    return this.getAllOptions(widget, options);
  }

  protected getBaseOption(widget, options): EditWidgetFormOptions {
    return {
      name: {
        enabled: true,
        value: widget.name,
        section: WidgetSection.info
      },
      type: {
        enabled: true,
        value: widget.type
      },
      dataType: {
        enabled: true,
        value: widget.dataType,
        availableValues: options.dataTypes,
        section: WidgetSection.data
      },
      defaultSize: {
        enabled: true,
        value: widget.defaultSize,
        section: WidgetSection.appearance
      },
      subtitle: {
        enabled: true,
        value: widget.subtitle,
        section: WidgetSection.info
      },
      font: {
        enabled: true,
        value: widget.font,
        section: WidgetSection.appearance
      },
      titlePosition: {
        enabled: true,
        value: widget.titlePosition,
        section: WidgetSection.appearance
      }
    };
  }

  protected getWidgetInstance(widget: Widget): string[] {
    return widget.dimensions.reduce((acc, dimension) => {
      acc = _.union(acc, unionInstances(dimension));
      return acc;
    }, []);
  }
}

export class BarOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as BarWidget);
    return {
      ...this.getBaseOption(widget, options),
      chartStyle: {
        enabled: true,
        value: widget.chartStyle && widget.chartType ? `${widget.chartStyle} ${BarStyleDivider} ${widget.chartType}` : '',
        availableValues: this.getChartStyles(options)
      },
      mode: {
        enabled: true,
        value: widget.mode,
        availableValues: DataModeLocale,
        section: WidgetSection.appearance
      },
      measures: {
        enabled: true,
        value: widget.measures,
        availableValues: options.measures,
        choiceMode: 'multiple',
        section: WidgetSection.data
      },
      dimensions: {
        enabled: true,
        value: widget.dimensions,
        required: true,
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      instance: {
        enabled: true,
        value: this.getWidgetInstance(widget),
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      windows: {
        enabled: true,
        value: widget.windows,
        required: true,
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      showAllData: {
        enabled: this.getWidgetInstance(widget).length <= 0,
        value: widget.showAllData,
        section: WidgetSection.data
      },
      urls: {
        enabled: true,
        value: widget.urls,
        availableValues: widget.measures,
        section: WidgetSection.info
      },
      yAxisMin: {
        enabled: true,
        value: widget.yAxisMin,
        section: WidgetSection.data
      },
      yAxisMax: {
        enabled: true,
        value: widget.yAxisMax,
        section: WidgetSection.data
      },
      timestamps: {
        enabled: true,
        value: widget.timestamps,
        choiceMode: 'multiple',
        section: WidgetSection.data
      },
      hideLegend: {
        enabled: true,
        value: widget.hideLegend,
        section: WidgetSection.appearance
      },
      stackBy: {
        enabled: true,
        value: widget.stackBy && widget.mode.value === WidgetMode.Instances ? widget.stackBy : [],
        section: WidgetSection.appearance
      }
    };
  }

  private getChartStyles(options) {
    const items = [];
    options.chartTypes.forEach(chartType => {
      options.chartStyles.forEach(chartStyle => {
        const temp = {
          key: `${chartStyle.key} ${BarStyleDivider} ${chartType.key}`,
          type: chartType.value,
          style: chartStyle.value
        };
        items.push(temp);
      });
    });
    return items;
  }
}

export class BillBoardOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as BillboardWidget);
    return {
      ...this.getBaseOption(widget, options),
      measures: {
        enabled: true,
        value: widget.measures,
        availableValues: options.measures,
        choiceMode: 'single',
        section: WidgetSection.data
      },
      dimensions: {
        enabled: true,
        value: widget.dimensions,
        required: true,
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      instance: {
        enabled: true,
        value: this.getWidgetInstance(widget),
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      windows: {
        enabled: true,
        value: widget.windows,
        required: true,
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      thresholdColor: {
        enabled: true,
        value: widget.thresholdColor,
        section: WidgetSection.appearance
      },
      urls: {
        enabled: true,
        value: widget.urls,
        availableValues: widget.measures,
        section: WidgetSection.info
      },
      timestamps: {
        enabled: true,
        value: widget.timestamps,
        choiceMode: 'single',
        section: WidgetSection.data
      },
      flashing: {
        enabled: true,
        value: isNullOrUndefined(widget.flashing) ? false : widget.flashing,
        section: WidgetSection.appearance
      },
      color: {
        enabled: true,
        value: widget.color,
        section: WidgetSection.appearance
      }
    };
  }
}

export class CallTimeLineOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as CallTimeLineWidget);
    return {
      ...this.getBaseOption(widget, options),
      chartType: {
        enabled: true,
        value: widget.chartType,
        availableValues: options.chartTypes,
        section: WidgetSection.appearance
      },
      measures: {
        enabled: true,
        value: widget.measures,
        availableValues: options.measures,
        choiceMode: 'single',
        section: WidgetSection.data
      },
      segmentTypes: {
        enabled: true,
        value: widget.segmentTypes,
        choiceMode: 'multiple',
        availableValues: options.segmentTypes,
        section: WidgetSection.data
      },
      groupBy: {
        enabled: true,
        value: widget.groupBy,
        availableValues: options.groupByList,
        section: WidgetSection.appearance
      },
      queues: {
        enabled: true,
        value: widget.queues,
        choiceMode: 'multiple',
        section: WidgetSection.data
      },
      agents: {
        enabled: true,
        value: widget.agents,
        choiceMode: 'multiple',
        section: WidgetSection.data
      },
      urls: {
        enabled: true,
        value: widget.urls,
        availableValues: widget.measures,
        section: WidgetSection.info
      },
      enableNavigator: {
        enabled: true,
        value: widget.enableNavigator,
        section: WidgetSection.appearance
      }
    };
  }
}

export class GeoMapOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as GeoMapWidget);
    return {
      ...this.getBaseOption(widget, options),
      measures: {
        enabled: true,
        value: widget.measures,
        availableValues: options.measures,
        choiceMode: 'single',
        section: WidgetSection.data
      },
      dimensions: {
        enabled: true,
        value: widget.dimensions,
        required: true,
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      instance: {
        enabled: true,
        value: this.getWidgetInstance(widget),
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      windows: {
        enabled: true,
        value: widget.windows,
        required: true,
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      urls: {
        enabled: true,
        value: widget.urls,
        availableValues: widget.measures,
        section: WidgetSection.info
      },
      displayMode: {
        enabled: true,
        value: widget.displayMode,
        availableValues: options.displayModes,
        section: WidgetSection.appearance
      },
      showAllData: {
        enabled: true,
        value: widget.showAllData,
        section: WidgetSection.data
      },
      stateColor: {
        enabled: true,
        value: widget.stateColor,
        section: WidgetSection.appearance
      },
      timestamps: {
        enabled: true,
        value: widget.timestamps,
        choiceMode: 'single',
        section: WidgetSection.data
      },
      hideLegend: {
        enabled: true,
        value: widget.hideLegend,
        section: WidgetSection.appearance
      }
    };
  }
}

export class LineOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as LineWidget);
    return {
      ...this.getBaseOption(widget, options),
      chartType: {
        enabled: true,
        value: widget.chartType,
        availableValues: options.chartTypes
      },
      enableNavigator: {
        enabled: true,
        value: widget.enableNavigator,
        section: WidgetSection.appearance
      },
      measures: {
        enabled: true,
        value: widget.measures,
        availableValues: options.measures,
        choiceMode: 'multiple',
        section: WidgetSection.data
      },
      dimensions: {
        enabled: true,
        value: widget.dimensions,
        required: true,
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      instance: {
        enabled: true,
        value: this.getWidgetInstance(widget),
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      windows: {
        enabled: true,
        value: widget.windows,
        required: true,
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      thresholdLine: {
        enabled: true,
        value: widget.thresholdLine,
        section: WidgetSection.appearance
      },
      showAllData: {
        enabled: this.getWidgetInstance(widget).length <= 0,
        value: widget.showAllData,
        section: WidgetSection.data
      },
      timestamps: {
        enabled: true,
        value: widget.timestamps,
        choiceMode: 'multiple',
        section: WidgetSection.data
      },
      customTimeRange: {
        enabled: true,
        value: widget.customTimeRange ? widget.customTimeRange : null,
        required: true,
        inputValidators: validateFunc,
        section: WidgetSection.data
      },
      hideKPI: {
        enabled: true,
        value: widget.hideKPI,
        section: WidgetSection.appearance
      },
      hideLegend: {
        enabled: true,
        value: widget.hideLegend,
        section: WidgetSection.appearance
      }
    };
  }
}

export class SankeyOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as SankeyWidget);
    return {
      ...this.getBaseOption(widget, options),
      measures: {
        enabled: true,
        value: widget.measures,
        availableValues: options.measures,
        required: true,
        choiceMode: 'multiple',
        section: WidgetSection.data
      },
      nodes: {
        enabled: true,
        value: widget.nodes,
        section: WidgetSection.data
      },
      urls: {
        enabled: true,
        value: widget.urls,
        availableValues: widget.measures,
        section: WidgetSection.info
      },
      dimensions: {
        enabled: true,
        value: widget.dimensions,
        required: true,
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        // inputValidators: [this.validateInstanceFormat],
        section: WidgetSection.data
      },
      instance: {
        enabled: true,
        value: this.getWidgetInstance(widget),
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      windows: {
        enabled: true,
        value: widget.windows,
        required: true,
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      showAllData: {
        enabled: this.getWidgetInstance(widget).length <= 0,
        value: widget.showAllData,
        section: WidgetSection.data
      }
    };
  }

  private  validateInstanceFormat(value: { instances: string[] }, input: string): boolean {
    if (input.length <= 0) {
      return true;
    }
    const inputKeys = input.split(',');
    const validItems = inputKeys.filter(item => item.trim().length > 0);
    return inputKeys.length === 2 && validItems.length === 2;
  }
}

export class SolidGaugeOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as SolidGaugeWidget);
    return {
      ...this.getBaseOption(widget, options),
      measures: {
        enabled: true,
        value: widget.measures,
        availableValues: options.measures,
        choiceMode: 'single',
        section: WidgetSection.data
      },
      dimensions: {
        enabled: true,
        value: widget.dimensions,
        required: true,
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      instance: {
        enabled: true,
        value: this.getWidgetInstance(widget),
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      windows: {
        enabled: true,
        value: widget.windows,
        required: true,
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      gaugeThreshold: {
        enabled: true,
        value: widget.gaugeThreshold,
        required: false,
        section: WidgetSection.appearance
      },
      displayMode: {
        enabled: true,
        value: widget.displayMode,
        availableValues: options.displayModes,
        section: WidgetSection.appearance
      },
      urls: {
        enabled: true,
        value: widget.urls,
        availableValues: widget.measures,
        section: WidgetSection.info
      },
      timestamps: {
        enabled: true,
        value: widget.timestamps,
        choiceMode: 'single',
        section: WidgetSection.data
      },
      gaugeValue: {
        enabled: true,
        value: widget.gaugeValue,
        required: false,
        section: WidgetSection.appearance
      },
      arcWidth: {
        enabled: true,
        value: widget.arcWidth,
        required: false,
        section: WidgetSection.appearance
      }
    };
  }
}

export class LiquidFillGaugeOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as LiquidFillGaugeWidget);
    return {
      ...this.getBaseOption(widget, options),
      measures: {
        enabled: true,
        value: widget.measures,
        availableValues: options.measures,
        choiceMode: 'single',
        section: WidgetSection.data
      },
      dimensions: {
        enabled: true,
        value: widget.dimensions,
        required: true,
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      instance: {
        enabled: true,
        value: this.getWidgetInstance(widget),
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      windows: {
        enabled: true,
        value: widget.windows,
        required: true,
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      minValue: {
        enabled: true,
        value: widget.minValue,
        section: WidgetSection.data
      },
      maxValue: {
        enabled: true,
        value: widget.maxValue,
        section: WidgetSection.data
      },
      circleThickness: {
        enabled: true,
        value: widget.circleThickness,
        section: WidgetSection.appearance
      },
      circleFillGap: {
        enabled: true,
        value: widget.circleFillGap,
        section: WidgetSection.appearance
      },
      circleColor: {
        enabled: true,
        value: widget.circleColor,
        section: WidgetSection.appearance
      },
      waveHeight: {
        enabled: true,
        value: widget.waveHeight,
        section: WidgetSection.appearance
      },
      waveCount: {
        enabled: true,
        value: widget.waveCount,
        section: WidgetSection.appearance
      },
      waveRiseTime: {
        enabled: true,
        value: widget.waveRiseTime,
        section: WidgetSection.appearance
      },
      waveAnimateTime: {
        enabled: true,
        value: widget.waveAnimateTime,
        section: WidgetSection.appearance
      },
      waveRise: {
        enabled: true,
        value: widget.waveRise,
        section: WidgetSection.appearance
      },
      waveHeightScaling: {
        enabled: true,
        value: widget.waveHeightScaling,
        section: WidgetSection.appearance
      },
      waveAnimate: {
        enabled: true,
        value: widget.waveAnimate,
        section: WidgetSection.appearance
      },
      waveColor: {
        enabled: true,
        value: widget.waveColor,
        section: WidgetSection.appearance
      },
      waveOffset: {
        enabled: true,
        value: widget.waveOffset,
        section: WidgetSection.appearance
      },
      textVertPosition: {
        enabled: true,
        value: widget.textVertPosition,
        section: WidgetSection.appearance
      },
      textSize: {
        enabled: true,
        value: widget.textSize,
        section: WidgetSection.appearance
      },
      valueCountUp: {
        enabled: true,
        value: widget.valueCountUp === true,
        section: WidgetSection.appearance
      },
      displayPercent: {
        enabled: true,
        value: widget.displayPercent === true,
        section: WidgetSection.appearance
      },
      textColor: {
        enabled: true,
        value: widget.textColor,
        section: WidgetSection.appearance
      },
      waveTextColor: {
        enabled: true,
        value: widget.waveTextColor,
        section: WidgetSection.appearance
      }
    };
  }
}

export class SunburstOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as SunburstWidget);
    return {
      ...this.getBaseOption(widget, options),
      measures: {
        enabled: true,
        value: widget.measures,
        availableValues: options.measures,
        choiceMode: 'single',
        section: WidgetSection.data
      },
      dimensions: {
        enabled: true,
        value: widget.dimensions,
        required: true,
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        inputValidators: [this.validateInstanceLevel],
        description: 'New instance must be same level with the first instance.',
        section: WidgetSection.data
      },
      instance: {
        enabled: true,
        required: true,
        value: this.getWidgetInstance(widget),
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      windows: {
        enabled: true,
        value: widget.windows,
        required: true,
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      showAllData: {
        enabled: this.getWidgetInstance(widget).length <= 0,
        value: widget.showAllData,
        section: WidgetSection.data
      },
      displayMode: {
        enabled: true,
        value: widget.displayMode,
        availableValues: options.displayModes,
        section: WidgetSection.appearance
      },
      labelMode: {
        enabled: true,
        value: widget.labelMode,
        availableValues: options.labelModes,
        section: WidgetSection.appearance
      },
      urls: {
        enabled: true,
        value: widget.urls,
        availableValues: widget.measures,
        section: WidgetSection.info
      },
      timestamps: {
        enabled: true,
        value: widget.timestamps,
        choiceMode: 'single',
        section: WidgetSection.data
      }
    };
  }

  private validateInstanceLevel(widget: { instances: string[], values: string[] }, input: string): boolean {
    const instances = widget.instances ? widget.instances : widget.values;
    if (!instances || instances.length <= 0) {
      return true;
    }
    return input && instances[0].split(',').length === input.split(',').length;
  }
}

export class TrendDiffOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as TrendDiffWidget);
    return {
      ...this.getBaseOption(widget, options),
      chartType: {
        enabled: true,
        value: widget.chartType,
        availableValues: options.chartTypes,
        section: WidgetSection.appearance
      },
      measures: {
        enabled: true,
        value: widget.measures,
        availableValues: options.measures,
        choiceMode: 'single',
        section: WidgetSection.data
      },
      dimensions: {
        enabled: true,
        value: widget.dimensions,
        required: true,
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      instance: {
        enabled: true,
        value: this.getWidgetInstance(widget),
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      windows: {
        enabled: true,
        value: widget.windows,
        required: true,
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      trendType: {
        enabled: true,
        value: widget.trendType,
        availableValues: options.trendTypes,
        section: WidgetSection.appearance
      },
      period: {
        enabled: true,
        value: widget.period,
        required: true,
        section: WidgetSection.data
      },
      numberOfLines: {
        enabled: true,
        value: widget.numberOfLines,
        section: WidgetSection.data
      },
      urls: {
        enabled: true,
        value: widget.urls,
        availableValues: widget.measures,
        section: WidgetSection.info
      },
      timestamps: {
        enabled: true,
        value: widget.timestamps,
        choiceMode: 'multiple',
        section: WidgetSection.data
      },
      hideLegend: {
        enabled: true,
        value: widget.hideLegend,
        section: WidgetSection.appearance
      }
    };
  }
}

export class TabularOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as TabularWidget);
    return {
      ...this.getBaseOption(widget, options),
      columns: {
        enabled: true,
        value: widget.columns,
        availableValues: options.columns,
        section: WidgetSection.data
      },
      dimensions: {
        enabled: true,
        value: widget.dimensions,
        required: true,
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      instance: {
        enabled: true,
        value: this.getWidgetInstance(widget),
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      windows: {
        enabled: true,
        value: widget.windows,
        required: true,
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      showAllData: {
        enabled: this.getWidgetInstance(widget).length <= 0,
        value: widget.showAllData,
        section: WidgetSection.data
      },
      displayData: {
        enabled: true,
        value: widget.displayData,
        availableValues: options.displayData,
        section: WidgetSection.appearance
      },
      flashing: {
        enabled: true,
        value: isNullOrUndefined(widget.flashing) ? true : widget.flashing,
        section: WidgetSection.appearance
      },
      urls: {
        enabled: true,
        value: widget.urls,
        availableValues: widget.measures,
        section: WidgetSection.info
      },
      customTimeRange: {
        enabled: widget.displayData === DataDisplayType.ShowInterval,
        value: widget.displayData === DataDisplayType.ShowInterval ? widget.customTimeRange : null,
        required: false,
        section: WidgetSection.data
      },
      hideIcon: {
        enabled: true,
        value: widget.hideIcon,
        section: WidgetSection.appearance
      }
    };
  }
}

export class LabelOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as BarWidget);
    return {
      name: {
        enabled: true,
        value: widget.name
      },
      subtitle: {
        enabled: true,
        value: widget.subtitle
      },
      titlePosition: {
        enabled: true,
        value: widget.titlePosition,
      },
      type: {
        enabled: false,
        value: widget.type
      }
    };
  }
}

export class EventViewerOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as BarWidget);
    return {
      name: {
        enabled: true,
        value: widget.name
      },
      titlePosition: {
        enabled: true,
        value: widget.titlePosition,
      },
      type: {
        enabled: false,
        value: widget.type
      }
    };
  }
}

export class BubbleOptions extends AbstractFormOptions {
  protected getAllOptions(baseWidget: Widget, options: any): EditWidgetFormOptions {
    const widget = (baseWidget as BarWidget);
    return {
      ...this.getBaseOption(widget, options),
      measures: {
        enabled: true,
        value: widget.measures,
        availableValues: options.measures,
        choiceMode: 'multiple',
        section: WidgetSection.data
      },
      dimensions: {
        enabled: true,
        value: widget.dimensions,
        required: true,
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      instance: {
        enabled: true,
        value: this.getWidgetInstance(widget),
        choiceMode: FlexibleChoicePackage.MULTIPLE,
        section: WidgetSection.data
      },
      windows: {
        enabled: true,
        value: widget.windows,
        required: true,
        choiceMode: FlexibleChoicePackage.SINGLE,
        section: WidgetSection.data
      },
      showAllData: {
        enabled: this.getWidgetInstance(widget).length <= 0,
        value: widget.showAllData,
        section: WidgetSection.data
      }
    };
  }
}
