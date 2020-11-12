import {
  ColorPoint, createColorScheme, createInstanceColorScheme, getColorScheme
} from '../../../common/utils/color';
import {StateColor} from '../../../widgets/models';
import {DataSet, GroupKey, RealtimeData} from '../../models';
import {PropertyEvaluator} from '../converters';
import {getPropertiesFromGroupKey} from '../grouper/grouper';
import {ColorPalette, InstanceColor} from '../../../common/models/index';
import {ColorStyle} from '../../models/enum';
import {KpiThreshold} from '../../models/constants';
import {getInstanceColor} from '../../../common/utils/function';
import * as Color from 'color';

export class SeriesColorEvaluator implements PropertyEvaluator<any> {
  private _colorScheme = getColorScheme();
  private _colorIdx: number = 0;
  protected instanceColors = [];

  constructor(palette: ColorPalette = null, instanceColors?: InstanceColor[]) {
    if (palette) {
      this._colorScheme = createColorScheme(palette);
    }
    this.instanceColors = instanceColors;
  }

  evaluate(data: DataSet, key: GroupKey): any {
    return this.getNextColor(key);
  }

  getNextColor(key?: GroupKey) {
    let color;
    if (key && this.instanceColors) {
      const instanceColor = getInstanceColor(getPropertiesFromGroupKey(key).instance, this.instanceColors);
      color = instanceColor ? instanceColor.color : this.getColorByIndex().primary;
    } else {
      color = this.getColorByIndex().primary;
    }
    this._colorIdx++;
    return color;
  }

  getLightenColor() {
    const colors = this._colorScheme;
    const numberOfColors = colors.length;
    const color = colors[(this._colorIdx - 1) % numberOfColors].primary;
    return Color(color).lighten(0.1).hex();
  }

  private getColorByIndex(): { primary: string, secondary: string } {
    const colors = this._colorScheme;
    const numberOfColors = colors.length;
    return colors[this._colorIdx % numberOfColors];
  }
}

export class KpiSeriesColorEvaluator extends SeriesColorEvaluator {
  private _colorCache = {};

  evaluate(data: DataSet, key: GroupKey): any {
    const { group, measure, instance } = getPropertiesFromGroupKey(key);
    const colorKey = `${measure}${instance}`;
    if (group === KpiThreshold.Greater.value) {
      const greaterColor = this._colorCache[colorKey];
      if (!greaterColor) {
        return this._colorCache[colorKey] = super.evaluate(data, key);
      }
      return greaterColor;
    } else if (group === KpiThreshold.Lesser.value) {
      const lesserColor = this._colorCache[colorKey];
      if (!lesserColor) {
        return this._colorCache[colorKey] = super.evaluate(data, key);;
      }
      return lesserColor;
    } else {
      this._colorCache[colorKey] = super.evaluate(data, key);
      return this._colorCache[colorKey];
    }
  }
}

export abstract class HistoricalColorEvaluator implements PropertyEvaluator<any> {
  private _colors = getColorScheme();
  private _listMeasureInstances: string = '';
  // In case of bar chart display by time range
  private _isIncludeTimestamp: boolean = false;
  colorIdx = -1;
  instanceColors = [];
  instanceColorsScheme = [];
  instanceColor = null;
  constructor(palette: ColorPalette = null,
              instanceColors?: InstanceColor[],
              isIncludeTimestamp: boolean = false) {

    if (palette) {
      this._colors = createColorScheme(palette);
    }
    if (instanceColors && instanceColors.length > 0) {
      this.instanceColors = instanceColors;
      this.instanceColorsScheme = [...this._colors, ...createInstanceColorScheme(instanceColors)];
    }
    this._isIncludeTimestamp = isIncludeTimestamp;
  }

  abstract getPrimaryColor(color: ColorPoint): any;

  abstract getSecondaryColor(): any;

  abstract getThirdColor(): any;

  evaluate(data: DataSet, key: GroupKey, currentTimestamp: number = 0): any {
    this.instanceColor = getInstanceColor(getPropertiesFromGroupKey(key).instance, this.instanceColors);
    let isPrimary = true;
    data.forEach((record: RealtimeData) => {
      let temp = `${record.measureName}^${record.instance}`;
      if (this._isIncludeTimestamp) {
        temp += `^${record.measureTimestamp}`;
      }
      if (this._listMeasureInstances.includes(temp)) {
        isPrimary = false;
      }
      this._listMeasureInstances += temp + ';';
    });
    const group = getPropertiesFromGroupKey(key).group;
    if (!group || group === ColorStyle.Solid || isPrimary) {
      this.colorIdx = (this.colorIdx + 1) % this._colors.length;
    }
    const color = this.getColorByIndex();
    switch (group) {
      case ColorStyle.Slash: {
        return this.getSecondaryColor();
      }
      case ColorStyle.Dash: {
        return this.getThirdColor();
      }
      default: {
        return this.getPrimaryColor(color);
      }
    }
  }

  getIndex(): number {
    return this.instanceColor ? this.instanceColorsScheme.findIndex(item => item.primary === this.instanceColor.color) : this.colorIdx;
  }

  private getColorByIndex(): ColorPoint {
    return this.instanceColor ? this.instanceColorsScheme[this.colorIdx] : this._colors[this.colorIdx];
  }
}

export class PatternFillColorEvaluator extends HistoricalColorEvaluator {
  constructor(colorPalette: ColorPalette,
              instanceColors: InstanceColor[],
    isIncludeTimestamp: boolean = false ) {
    super(colorPalette, instanceColors, isIncludeTimestamp);
  }

  static getPatterns(palette: ColorPalette = null, instanceColors: InstanceColor[] = []) {
    const paletteSchema = !palette ? getColorScheme() : createColorScheme(palette);
    const instanceSchma = createInstanceColorScheme(instanceColors);
    const colors = [...paletteSchema, ...instanceSchma].map((color: ColorPoint) => color.secondary);
    const historicalData = colors.map(function (color, i) {
      return {
        id: 'historical-pattern-' + i,
        path: {
          d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
          stroke: color
        }
      };
    });
    const timestampData = colors.map(function (color, i) {
      return {
        id: 'custom-pattern-' + i,
        path: {
          d: 'M 0 3 L 10 3 M 0 8 L 10 8',
          stroke: color
        }
      };
    });
    return [...historicalData, ...timestampData];
  }

  getPrimaryColor(color: ColorPoint): any {
    return this.instanceColor ? this.instanceColor.color : color.primary;
  }

  getSecondaryColor(): any {
    return `url(#historical-pattern-${this.getIndex()})`;
  }

  getThirdColor(): any {
    return `url(#custom-pattern-${this.getIndex()})`;
  }
}

export class GeoMapColorEvaluator implements PropertyEvaluator<string> {
  private _stateColor: StateColor;

  constructor(stateColor: StateColor) {
    this._stateColor = stateColor;
  }

  evaluate(data: DataSet, key: GroupKey): string {
    return (this._stateColor && this._stateColor.capitalColor) ? this._stateColor.capitalColor : getColorScheme()[30].primary;
  }
}
