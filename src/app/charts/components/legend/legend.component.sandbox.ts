import {sandboxOf} from 'angular-playground';
import {LegendComponent} from './legend.component';
import {MatIconModule, MatTooltipModule} from '@angular/material';

export default sandboxOf(LegendComponent, {
  imports: [
    MatIconModule,
    MatTooltipModule
  ],
  declarations: [
    LegendComponent
  ]
})
.add('LegendComponent', {
  template: `<app-legend [legends]="legends"></app-legend>`,
  context: {
    legends: [
      {
        name: 'Aloha',
        color: '#FF0000',
        enabled: true
      }
    ]
  }
});
