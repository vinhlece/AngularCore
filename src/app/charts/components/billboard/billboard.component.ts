import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import * as _ from 'lodash';
import {MeasureFormat, WidgetThresholdColor} from '../../../widgets/models/enums';
import {BillboardData} from '../../../realtime/services/converters';
import {BillboardWidget} from '../../../widgets/models';
import {Dimension, REPStyles, WidgetMouseEvent} from '../../models';
import {isNumber} from 'util';
import {Measure} from '../../../measures/models/index';
import {getMomentByTimestamp} from '../../../common/services/timeUtils';
import {AppDateTimeFormat} from '../../../common/models/enums';
import {getInstanceColor, isNullOrUndefined, unionDimensions} from '../../../common/utils/function';
import {InstanceColor} from '../../../common/models/index';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';

@Component({
  selector: 'app-billboard',
  templateUrl: './billboard.component.html',
  styleUrls: ['./billboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillboardComponent {
  private _data: BillboardData = {
    current: { timestamp: 5, value: 100 },
    passed: { timestamp: null, value: null }
  };
  private _styles: REPStyles = {};
  private _size: Dimension = {width: 0, height: 0};
  private _minSize: number = 50;
  private _maxSize: number = 300;
  private _widget: BillboardWidget;
  private _measures: Measure[];
  private _themeService: ThemeService;

  format: string = null;
  @Input() instanceColors: InstanceColor[];
  @Input() isOverlayWidget: boolean;
  @Input()
  get widget(): BillboardWidget {
    return this._widget;
  }
  set widget(newWidget: BillboardWidget) {
    this._widget = newWidget;
    this.format = this.getMeasureFormat();
  }
  @Input()
  get measures(): Measure[] {
    return this._measures;
  }
  set measures(newMeasure: Measure[]) {
    this._measures = newMeasure;
    this.format = this.getMeasureFormat();
  }

  @Input()
  get data(): BillboardData {
    return this._data;
  }

  set data(value: BillboardData) {
    if (!this.isOverlayWidget) {
      if (value && isNumber(value.current.value) && !_.isEqual(this._data, value)) {
        this._data = value;
        this.onChange.emit();
      }
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
    this._size = value || {width: 0, height: 0};
  }

  @Output() onMouseDown = new EventEmitter<WidgetMouseEvent>();
  @Output() onDoubleClick = new EventEmitter<WidgetMouseEvent>();
  @Output() onChange = new EventEmitter<void>();
  @Output() onContextMenu = new EventEmitter<WidgetMouseEvent>();

  get pastStyles() {
    const font = {
      'color': this.getPastColor(),
      'font-size': this.getPastFontSize()
    };
    if (this.widget.font) {
      const {fontFamily, fontWeight} = this.widget.font;
      return {
        ...font,
        fontFamily,
        fontWeight
      };
    }
    return font;
  }

  get latestStyles() {
    const color = this.widget.color;
    const fontSize = this.widget.font ? this.widget.font.fontSize : null;
    const billboardFontSize = isNumber(this.getPastValue()) ? this.getSecondaryLatestFontSize(fontSize) : this.getLatestFontSize(fontSize);
    const instanceColor = getInstanceColor(unionDimensions(this.widget)[0], this.instanceColors);
    const font: any = {
      'color': color ? color : instanceColor ? instanceColor.color : '#102A3A',
      'font-size': billboardFontSize,
    };
    if (this.isDarkTheme()) {
      font.color = '#CCC';
    }
    if (this.widget.font) {
      const {fontFamily, fontWeight} = this.widget.font;
      return {
        ...font,
        fontFamily,
        fontWeight
      };
    }
    return font;
  }

  get indicatorStyles() {
    return {
      'color': this.getPastColor(),
      'font-size': this.getIndicatorFontSize()
    };
  }

  constructor(themeService: ThemeService) {
    this._themeService = themeService
  }

  isLatest() {
    return !this.data.passed || !isNumber(this.data.passed.value);
  }

  handleMouseDown(event) {
    event.widget = this.widget;
    event.otherParams = this.getOtherParams();
    this.onMouseDown.emit(event);
  }

  handleDoubleClick(event: any) {
    event.widget = this.widget;
    this.onDoubleClick.emit(event);
  }

  handleRightClick(event: any) {
    event.preventDefault();
    event.widget = this.widget;
    event.otherParams = this.getOtherParams();
    this.onContextMenu.emit(event);
  }

  showLastestValue() {
    return this.convertTimeFormat(this.data.current.value);
  }

  showHistoricalValue() {
    return this.convertTimeFormat(this.data.passed.value);
  }

  getMeasureFormat() {
    if (this.measures && this.widget.measures.length > 0) {
      const current = this.measures.find(measure => measure.name === this.widget.measures[0] && measure.format === MeasureFormat.time);
      if (current) {
        return AppDateTimeFormat.time;
      }
    }
    return null;
  }

  isDarkTheme() {
    return this._themeService.getCurrentTheme() === Theme.Dark;
  }

  private convertTimeFormat(value: number) {
    return getMomentByTimestamp(value * 1000).format(this.format);
  }

  private getPastColor(): WidgetThresholdColor {
    const past = this.getPastValue();
    const latest = this.getLatestValue();

    let color;

    if (!this.widget.thresholdColor || past === latest) {
      color = WidgetThresholdColor.Black;
      return color;
    }

    if (past > latest) {
      color = this.widget.thresholdColor.greater;
    } else if (past < latest) {
      color = this.widget.thresholdColor.lesser;
    } else {
      color = WidgetThresholdColor.Black;
    }

    return color;
  }

  private getLatestFontSize(inputFontSize: number): string {
    // only display latest value => containerWidth = chart width
    const fontSize = inputFontSize ? inputFontSize : this.getRespensiveFontSize(this.getLatestValue().toString(), this.size.width, this.size.height);
    return `${fontSize}px`;
  }

  private getSecondaryLatestFontSize(inputFontSize: number): string {
    // show latest value and past value => containerWidth = chart width / 2
    const fontSize = inputFontSize ? inputFontSize :
      this.getRespensiveFontSize(this.getLatestValue().toString(), this.size.width / 2, this.size.height);
    return `${fontSize}px`;
  }

  private getPastFontSize(): string {
    // get the longest text.
    let scale = 1;
    let text = this.getPastValue().toString();
    if (this.getLatestValue().toString().length >= this.getPastValue().toString().length) {
      text = this.data.current.value.toString();
      scale = 0.7;
    }
    // show latest value and past value => containerWidth = chart width / 2
    let fontSize = this.getRespensiveFontSize(text, this.size.width / 2, this.size.height);
    // scale 70% to compare with latest value
    fontSize = Math.floor(fontSize * scale);
    return `${fontSize}px`;
  }

  private getIndicatorFontSize(): string {
    let fontSize = Math.floor(this.size.width < this.size.height ? this.size.width / 8 : this.size.height / 9);
    if (fontSize < this._minSize / 2) {
      fontSize = this._minSize / 2;
    }
    return `${fontSize}px`;
  }

  private getPastValue(): number {
    return this.data.passed ? this.data.passed.value : null;
  }

  private getLatestValue(): number {
    return this.data.current.value;
  }

  private getRespensiveFontSize(text: string, containerWidth: number, containerHeight) {
    // get fontSize by containerWidth and text length
    let fontSize = containerWidth / text.length;
    // if fontSize >  containerHeight ( height - 10: margin top  5px and bottom margin 5px)
    if (fontSize >= containerHeight - 10) {
      fontSize = containerHeight - 10;
    }
    // Round a number downward to its nearest integer
    const roundFont = Math.floor(fontSize);
    if (roundFont > this._maxSize) {
      return this._maxSize;
    } else if (roundFont < this._minSize) {
      return this._minSize;
    }
    return roundFont;
  }

  private getOtherParams(): object {
    return {
      timestamp: this._data.current.timestamp,
      [this.widget.measures[0].toLowerCase()]: this._data.current.value
    };
  }
}
