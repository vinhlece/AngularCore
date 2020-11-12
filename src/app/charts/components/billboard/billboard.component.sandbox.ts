import {BillboardComponent} from './billboard.component';
import {sandboxOf} from 'angular-playground';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule, MatIconModule, MatSelectModule} from '@angular/material';
import {MatInputModule, MatCheckboxModule, MatChipsModule} from '@angular/material';
import {mockBillboardWidget} from '../../../common/testing/mocks/widgets';

export default sandboxOf(BillboardComponent, {
  imports: [
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
  ],
  declarations: [
    BillboardComponent
  ]
})
  .add('Billboard with current data only', {
  template: `<div style="width: 300px; height: 200px">
      <app-billboard
        style="background-color: #cecece"
        [widget]="widget"
        [data]= "data"
      ></app-billboard>
    </div>
  `,
  context: {
    widget: mockBillboardWidget(),
    data: {
      current: {timestamp: 12354367, value: 3232342450},
      passed: null
    }
  }
})
  .add('Billboard with current and passed data', {
  template: `<div style="width: 300px; height: 200px;">
      <app-billboard
        style="background-color: #cecece"
        [widget]="widget"
        [data]= "data"
      ></app-billboard>
    </div>
  `,
  context: {
    widget: mockBillboardWidget(),
    data: {
      current: {timestamp: 12354367, value: 533},
      passed: {timestamp: 11154367, value: 5466}
    }
  }
});
