import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import * as d3 from './index';
import { isNil, isEqual, isEmpty } from 'lodash';
import { isNullOrUndefined, isNumber } from 'util';
import { LiquidFillGaugeWidget } from '../../../widgets/models';
import { AppDateTimeFormat } from '../../../common/models/enums';
import { Measure } from '../../../measures/models/index';
import { Dimension, REPStyles, WidgetMouseEvent } from '../../models';
import { LiquidFillGaugeData } from '../../../realtime/services/converters';
import { MeasureFormat } from '../../../widgets/models/enums';
import { uuid } from '../../../common/utils/uuid';

@Component({
  selector: 'app-liquid-fill-gauge',
  templateUrl: './liquid-fill-gauge.component.html',
  styleUrls: ['./liquid-fill-gauge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiquidFillGaugeComponent
  implements OnInit, AfterViewInit, OnChanges {
  constructor() {}

  config1;
  config2;
  counterGauge1;
  titleGuage;
  id: String;
  format: string = null;

  private _widget: LiquidFillGaugeWidget;
  private _measures: Measure[];
  private _data: LiquidFillGaugeData;
  private _styles: REPStyles = {};
  private _size: Dimension = { width: 0, height: 0 };
  private _value: number;

  @Input()
  get widget(): LiquidFillGaugeWidget {
    return this._widget;
  }
  set widget(newWidget: LiquidFillGaugeWidget) {
    console.log('newWidget', newWidget);
    this._widget = newWidget;
    this.format = this.getMeasureFormat();
  }

  @Input()
  get data(): LiquidFillGaugeData {
    return this._data;
  }

  set data(value: LiquidFillGaugeData) {
    console.log('data', value);
    if (value && isNumber(value.current.value) && !isEqual(this._data, value)) {
      this._data = value;
      this._value = this._data.current.value;
      this.onChange.emit();
    } else if (value && isNullOrUndefined(value.current.value)) {
      this._data = null;
      this.onChange.emit();
    }
  }

  @Input()
  get styles(): REPStyles {
    return this._styles ? this._styles : {};
  }

  set styles(value: REPStyles) {
    this._styles = value;
  }

  @Input()
  get size(): Dimension {
    return this._size;
  }

  set size(value: Dimension) {
    console.log('size', value);
    this._size = value || { width: 0, height: 0 };
  }

  @Input()
  get measures(): Measure[] {
    return this._measures;
  }
  set measures(newMeasure: Measure[]) {
    console.log('measures', newMeasure);
    this._measures = newMeasure;
    this.format = this.getMeasureFormat();
  }

  @Output() onMouseDown = new EventEmitter<WidgetMouseEvent>();
  @Output() onDoubleClick = new EventEmitter<WidgetMouseEvent>();
  @Output() onChange = new EventEmitter<void>();
  @Output() onContextMenu = new EventEmitter<WidgetMouseEvent>();

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    let widgetChanges;

    if (isNil(changes['widget']) || isNil(changes['widget'].currentValue)) {
      widgetChanges = this._widget;
    } else {
      widgetChanges = changes['widget'].currentValue;
    }

    if (isNil(widgetChanges)) {
      widgetChanges = [];
    }

    if (isNil(this.config1)) {
      this.config1 = this.liquidFillGaugeDefaultSettings();
    }

    if (isNil(this.config2)) {
      this.config2 = this.liquidFillGaugeDefaultSettings();
    }

    const widgetChangeKeys = Object.keys(this.config1);
    widgetChangeKeys.forEach(key => {
      if (!isNil(this._widget[key])) {
        this.config1 = Object.assign(this.config1, {
          [key]: this._widget[key].value
        });
      }
    });

    const widgetChangeKeys2 = Object.keys(this.config2);

    widgetChangeKeys2.forEach(key => {
      if (!isNil(this._widget[key])) {
        this.config2 = Object.assign(this.config2, {
          [key]: this._widget[key].value
        });
      }
    });

    this.config2.displayPercent = 'false';
    this.config2.textSize = 0.4;

    if (!isNil(changes['data']) && !isNil(changes['data'].currentValue)) {
      this._data = changes['data'].currentValue;
      this._value = this._data.current.value;
    }

    if (isNil(this.id)) {
      this.id = uuid();
    }

    if (!isNil(this._widget) && !isNil(this._value)) {
      this.counterGauge1 = this.loadLiquidFillGauge(
        'fillgauge-' + this.id,
        this._value,
        this.config1
      );

      this.titleGuage = this.loadLiquidFillGauge(
        'fillgauge-title-' + this.id,
        this._value,
        this.config2,
        this._widget.measures[0]
      );
    }
  }

  ngAfterViewInit() {
    const widgetChangeKeys = Object.keys(this.config1);
    widgetChangeKeys.forEach(key => {
      if (!isNil(this._widget[key])) {
        this.config1 = Object.assign(this.config1, {
          [key]: this._widget[key].value
        });
      }
    });

    const widgetChangeKeys2 = Object.keys(this.config2);

    widgetChangeKeys2.forEach(key => {
      if (!isNil(this._widget[key])) {
        this.config2 = Object.assign(this.config2, {
          [key]: this._widget[key].value
        });
      }
    });

    this.config2.displayPercent = 'false';
    this.config2.textSize = 0.4;

    if (isNil(this.id)) {
      this.id = uuid();
    }

    if (!isNil(this._widget) && !isNil(this._value)) {
      this.counterGauge1 = this.loadLiquidFillGauge(
        'fillgauge-' + this.id,
        this._value,
        this.config1
      );

      this.titleGuage = this.loadLiquidFillGauge(
        'fillgauge-title-' + this.id,
        this._value,
        this.config2,
        this._widget.measures[0]
      );
    }

  }

  liquidFillGaugeDefaultSettings() {
    //     minValue: 0, // The gauge minimum value.
    //     maxValue: 100, // The gauge maximum value.
    //     circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
    //     circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
    //     circleColor: '#178BCA', // The color of the outer circle.
    //     waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
    //     waveCount: 1, // The number of full waves per width of the wave circle.
    //     waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
    //     waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
    //     waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
    //     waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages.
    //     When true, wave height reaches it's maximum at 50% fill,
    //     and minimum at 0% and 100% fill.
    //     This helps to prevent the wave from making the wave circle from appear totally full or
    //     empty when near it's minimum or maximum fill.
    //     waveAnimate: true, // Controls if the wave scrolls or is static.
    //     waveColor: '#178BCA', // The color of the fill wave.
    //     waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
    //     textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
    //     textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
    //     valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading.
    //     If false, the final value is displayed.
    //     displayPercent: true, // If true, a % symbol is displayed after the value.
    //     textColor: '#045681', // The color of the value text when the wave does not overlap it.
    //     waveTextColor: '#A4DBf8' // The color of the value text when the wave overlaps it.
    return {
      minValue: 0,
      maxValue: 100,
      circleThickness: 0.05,
      circleFillGap: 0.05,
      circleColor: '#178BCA',
      waveHeight: 0.05,
      waveCount: 5,
      waveRiseTime: 1000,
      waveAnimateTime: 1000,
      waveRise: true,
      waveHeightScaling: true,
      waveAnimate: true,
      waveColor: '#178BCA',
      waveOffset: 0,
      textVertPosition: 0.5,
      textSize: 1,
      valueCountUp: true,
      displayPercent: false,
      textColor: '#045681',
      waveTextColor: '#A4DBf8'
    };
  }

  parseConfig(config) {
    // !(config.waveAnimate === 'false') || !(config.waveAnimate === false),
    // config.waveRise !== 'false' || config.waveRise !== false,
    // config.waveHeightScaling !== 'false' || config.waveHeightScaling !== false,
    // config.valueCountUp !== 'false' || config.valueCountUp !== false
    // config.displayPercent === 'true' || config.displayPercent === true
    config.waveCount = parseFloat(config.waveCount) <= 0 ? 1 : config.waveCount;
    config.waveCount = parseFloat(config.waveCount) >= 6 ? 5 : config.waveCount;
    config.textVertPosition = parseFloat(config.textVertPosition) < 0 ? 0 : config.textVertPosition;
    config.textVertPosition = parseFloat(config.textVertPosition) > 1 ? 1 : config.textVertPosition;
    return {
      minValue: parseFloat(config.minValue),
      maxValue: parseFloat(config.maxValue),
      circleThickness: parseFloat(config.circleThickness),
      circleFillGap: parseFloat(config.circleFillGap),
      circleColor: config.circleColor,
      waveHeight: parseFloat(config.waveHeight),
      waveCount: parseFloat(config.waveCount),
      waveRiseTime: parseFloat(config.waveRiseTime),
      waveAnimateTime: parseFloat(config.waveAnimateTime),
      waveRise: config.waveRise,
      waveHeightScaling: config.waveHeightScaling,
      waveAnimate: config.waveAnimate,
      waveColor: config.waveColor,
      waveOffset: parseFloat(config.waveOffset),
      textVertPosition: parseFloat(config.textVertPosition),
      textSize: parseFloat(config.textSize),
      valueCountUp: config.valueCountUp,
      displayPercent: config.displayPercent,
      textColor: config.textColor,
      waveTextColor: config.waveTextColor
    };
  }

  loadLiquidFillGauge(elementId, value, config, title?) {
    config = this.parseConfig(config);

    console.log('loadLiquidFillGaugeWidget', elementId, value, config, title);

    if (config == null) {
      config = this.liquidFillGaugeDefaultSettings();
    }
    const margin = 20;
    const gauge = d3.select('#' + elementId);
    gauge.selectAll('g').remove();
    const radius =
      Math.min(this.size.width - margin, this.size.height - 20) / 2;
    const locationY = this.size.height / 2 - radius;
    const locationX = this.size.width / 2 - radius;
    const fillPercent =
      Math.max(config.minValue, Math.min(config.maxValue, value)) /
      config.maxValue;

    let waveHeightScale;
    if (config.waveHeightScaling) {
      waveHeightScale = d3
        .scaleLinear()
        .range([0, config.waveHeight, 0])
        .domain([0, 50, 100]);
    } else {
      waveHeightScale = d3
        .scaleLinear()
        .range([config.waveHeight, config.waveHeight])
        .domain([0, 100]);
    }

    const textPixels = (config.textSize * radius) / 2;
    const textFinalValue = parseFloat(value).toFixed(2);
    let percentText = config.displayPercent ? '%' : '';

    let textStartValue;

    if (!isNil(title)) {
      textStartValue = title;
      percentText = '';
    } else {
      textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
      textStartValue = Math.round(textStartValue) + percentText;
    }

    const circleThickness = config.circleThickness * radius;
    const circleFillGap = config.circleFillGap * radius;
    const fillCircleMargin = circleThickness + circleFillGap;
    const fillCircleRadius = radius - fillCircleMargin;
    const waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

    const waveLength = (fillCircleRadius * 2) / config.waveCount;
    const waveClipCount = 1 + config.waveCount;
    const waveClipWidth = waveLength * waveClipCount;

    // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
    let textRounder = Math.round(value);
    const textFinalValueNum = parseFloat(textFinalValue);

    if (parseFloat(textFinalValue) !== Math.round(textFinalValueNum)) {
      textRounder = parseFloat(parseFloat(value).toFixed(1));
    }

    if (parseFloat(textFinalValue) !== Math.round(textFinalValueNum)) {
      textRounder = parseFloat(parseFloat(value).toFixed(2));
    }

    // Data for building the clip wave area.
    const data = [];
    for (let i = 0; i <= 40 * waveClipCount; i++) {
      data.push({ x: i / (40 * waveClipCount), y: i / 40 });
    }

    // Scales for drawing the outer circle.
    const gaugeCircleX = d3
      .scaleLinear()
      .range([0, 2 * Math.PI])
      .domain([0, 1]);
    const gaugeCircleY = d3
      .scaleLinear()
      .range([0, radius])
      .domain([0, radius]);

    // Scales for controlling the size of the clipping path.
    const waveScaleX = d3
      .scaleLinear()
      .range([0, waveClipWidth])
      .domain([0, 1]);
    const waveScaleY = d3
      .scaleLinear()
      .range([0, waveHeight])
      .domain([0, 1]);

    // Scales for controlling the position of the clipping path.
    const waveRiseScale = d3
      .scaleLinear()
      // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
      // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
      // circle at 100%.
      .range([
        fillCircleMargin + fillCircleRadius * 2 + waveHeight,
        fillCircleMargin - waveHeight
      ])
      .domain([0, 1]);
    const waveAnimateScale = d3
      .scaleLinear()
      .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
      .domain([0, 1]);

    // Scale for controlling the position of the text within the gauge.
    const textRiseScaleY = d3
      .scaleLinear()
      .range([
        fillCircleMargin + fillCircleRadius * 2,
        fillCircleMargin + textPixels * 0.7
      ])
      .domain([0, 1]);

    // Center the gauge within the parent SVG.
    const gaugeGroup = gauge
      .append('g')
      .attr('transform', 'translate(' + locationX + ',' + locationY + ')');

    // Draw the outer circle.
    const gaugeCircleArc = d3
      .arc()
      .startAngle(gaugeCircleX(0))
      .endAngle(gaugeCircleX(1))
      .outerRadius(gaugeCircleY(radius))
      .innerRadius(gaugeCircleY(radius - circleThickness));
    gaugeGroup
      .append('path')
      .attr('d', gaugeCircleArc)
      .style('fill', config.circleColor)
      .attr('transform', 'translate(' + radius + ',' + radius + ')');

    // Text where the wave does not overlap.
    const text1 = gaugeGroup
      .append('text')
      .text(textStartValue)
      .attr('class', 'liquidFillGaugeText')
      .attr('text-anchor', 'middle')
      .attr('font-size', textPixels + 'px')
      .style('fill', config.textColor)
      .attr(
        'transform',
        'translate(' +
          radius +
          ',' +
          textRiseScaleY(config.textVertPosition) +
          ')'
      );

    // The clipping wave area.
    const clipArea = d3
      .area()
      .x((d: any) => {
        return waveScaleX(d.x);
      })
      .y0((d: any) => {
        return waveScaleY(
          Math.sin(
            Math.PI * 2 * config.waveOffset * -1 +
              Math.PI * 2 * (1 - config.waveCount) +
              d.y * 2 * Math.PI
          )
        );
      })
      .y1(() => {
        return fillCircleRadius * 2 + waveHeight;
      });
    const waveGroup = gaugeGroup
      .append('defs')
      .append('clipPath')
      .attr('id', 'clipWave' + elementId);
    const wave = waveGroup
      .append('path')
      .datum(data)
      .attr('d', clipArea)
      .attr('T', 0);

    // The inner circle with the clipping wave attached.
    const fillCircleGroup = gaugeGroup
      .append('g')
      .attr('clip-path', 'url(#clipWave' + elementId + ')');
    fillCircleGroup
      .append('circle')
      .attr('cx', radius)
      .attr('cy', radius)
      .attr('r', fillCircleRadius)
      .style('fill', config.waveColor);

    // Text where the wave does overlap.
    const text2 = fillCircleGroup
      .append('text')
      .text(textStartValue)
      .attr('class', 'liquidFillGaugeText')
      .attr('text-anchor', 'middle')
      .attr('font-size', textPixels + 'px')
      .style('fill', config.waveTextColor)
      .attr(
        'transform',
        'translate(' +
          radius +
          ',' +
          textRiseScaleY(config.textVertPosition) +
          ')'
      );

    // Make the value count up.
    if (config.valueCountUp) {
      const textTween = function() {
        const i = d3.interpolate(textStartValue, textFinalValue);
        return function(t) {
          if (!isNil(title)) {
            this.textContent = title;
          } else {
            this.textContent = Math.round(parseFloat(i(t))) + percentText;
          }
        };
      };
      text1
        .transition()
        .duration(config.waveRiseTime)
        .tween('text', textTween);
      text2
        .transition()
        .duration(config.waveRiseTime)
        .tween('text', textTween);
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    const waveGroupXPosition =
      fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
    if (config.waveRise) {
      waveGroup
        .attr(
          'transform',
          'translate(' + waveGroupXPosition + ',' + waveRiseScale(0) + ')'
        )
        .transition()
        .duration(config.waveRiseTime)
        .attr(
          'transform',
          'translate(' +
            waveGroupXPosition +
            ',' +
            waveRiseScale(fillPercent) +
            ')'
        )
        .on('start', () => {
          wave.attr('transform', 'translate(1,0)');
        }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false.
      // The wave will not position correctly without this, but it's not clear why this is actually necessary.
    } else {
      waveGroup.attr(
        'transform',
        'translate(' +
          waveGroupXPosition +
          ',' +
          waveRiseScale(fillPercent) +
          ')'
      );
    }

    if (config.waveAnimate) {
      animateWave();
    }

    function animateWave() {
      wave.attr(
        'transform',
        'translate(' + waveAnimateScale(parseFloat(wave.attr('T'))) + ',0)'
      );
      wave
        .transition()
        .duration(config.waveAnimateTime * (1 - parseFloat(wave.attr('T'))))
        .ease(d3.easeLinear)
        .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
        .attr('T', 1)
        .on('end', () => {
          wave.attr('T', 0);
          animateWave();
        });
    }
  }

  getMeasureFormat() {
    if (this.measures && this._widget.measures.length > 0) {
      const current = this.measures.find(
        measure =>
          measure.name === this._widget.measures[0] &&
          measure.format === MeasureFormat.time
      );
      if (current) {
        return AppDateTimeFormat.time;
      }
    }
    return null;
  }
}
