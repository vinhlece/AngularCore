import {DataSet, GroupKey, RealtimeData} from '../../models';
import {createColorScheme, getColorScheme} from '../../../common/utils/color';
import {PropertyEvaluator} from '../converters';
import {OrderedSet} from 'immutable';
import {SankeyNode, SankeyWidget} from '../../../widgets/models';
import {ColorPalette, InstanceColor} from '../../../common/models/index';
import {getInstanceColor} from '../../../common/utils/function';

export class SankeyNodesEvaluator implements PropertyEvaluator<any> {
  private _widget: SankeyWidget;
  private _colorScheme = getColorScheme();
  private _instanceColors = [];

  constructor(widget: SankeyWidget, colorPalette: ColorPalette, instanceColors: InstanceColor[]) {
    this._widget = widget;
    if (colorPalette) {
      this._colorScheme = createColorScheme(colorPalette);
    }
    this._instanceColors = instanceColors;
  }

  evaluate(data: DataSet, key: GroupKey): any {
    return this.getIds(data).map((id: string, idx: number) => {
      const instanceColor = getInstanceColor(id, this._instanceColors);
      const node: SankeyNode = {
        id,
        color: instanceColor ? instanceColor.color : this.getColorByIndex(idx).primary
      };
      const nodeSettings = this.getNodeSettings(id);
      if (nodeSettings) {
        node.column = nodeSettings.column;
      }
      return node;
    });
  }

  private getNodeSettings(id: string): SankeyNode {
    if (!this._widget.nodes) {
      return null;
    }
    return this._widget.nodes.find((item: SankeyNode) => item.id === id);
  }

  private getIds(data: DataSet): string[] {
    const ids = data.reduce((acc: OrderedSet<string>, record: RealtimeData) => {
      const instance = record.instance;
      const keys = instance.split(',');
      const sankeyKeys = keys.slice(keys.length - 2);
      const [from, to] = sankeyKeys;
      acc = acc.add(from);
      acc = acc.add(to);
      return acc;
    }, OrderedSet<string>());
    return ids.toJS();
  }

  private getColorByIndex(idx: number): { primary: string, secondary: string } {
    const colors = this._colorScheme;
    const numberOfColors = colors.length;
    return colors[idx % numberOfColors];
  }
}
