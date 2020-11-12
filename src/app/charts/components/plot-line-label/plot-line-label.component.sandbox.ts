import {sandboxOf} from 'angular-playground';
import {PlotLineLabelComponent} from './plot-line-label.component';

export default sandboxOf(PlotLineLabelComponent, {})
  .add('plot line label', {
    template: `<app-plot-line-label [labels]="labels"></app-plot-line-label>`,
    context: {
      labels: [
        {name: 'label 1', color: 'red', value: 12},
        {name: 'label 2', color: 'green', value: 22},
        {name: 'label 3', color: 'blue', value: 44},
      ]
    }
  });
