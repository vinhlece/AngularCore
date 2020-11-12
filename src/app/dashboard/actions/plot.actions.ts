import {ActionWithPayload} from '../../common/actions';
import {PlotPoint} from '../models';

export const PLOT = '[Plot] Plot';

export class Plot implements ActionWithPayload<PlotPoint> {
  type = PLOT;

  constructor(public payload: PlotPoint) {
  }
}
