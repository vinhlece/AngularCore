import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {sandboxOf} from 'angular-playground';
import {TwinkleDirective} from '../../../layout/components/twinkle/twinkle.directive';
import {TabularCellComponent} from './tabular-cell.component';
import {MatIconModule} from '@angular/material';

export default sandboxOf(TabularCellComponent, {
  imports: [
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatIconModule
  ],
  declarations: [
    TwinkleDirective,
  ]
})
  .add('tabular cell', {
    template: `<app-tabular-cell [primary]="primary" [secondary]="secondary" style="width: 512px; height: 52px"></app-tabular-cell>`,
    context: {
      primary: {value: 100, color: 'black'},
      secondary: {value: 12, color: 'green'}
    }
  });
