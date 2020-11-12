import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {mockPackagesMeasures} from '../../../common/testing/mocks/widgets';
import {MeasureFormComponent} from './measure-form.component';

const packages = [
  mockPackagesMeasures('Queue', 'Queue Performance'),
  mockPackagesMeasures('Queue', 'Queue Status'),
  mockPackagesMeasures('Agent', ''),
];

export default sandboxOf(MeasureFormComponent, {
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    FlexLayoutModule,
    MatCheckboxModule
  ],
  declarations: []
})
  .add('Add Measure', {
    template: `<app-measure-form [packages]="packages"></app-measure-form>`,
    context: {
      packages: packages
    }
  })
  .add('Config Measure', {
    template: `<app-measure-form [packages]="packages" [measure]="measure"></app-measure-form>`,
    context: {
      packages: packages,
      measure: {
        name: 'InstantaneousContactsAnswered',
        format: 'number',
        relatedMeasures: [],
        dataType: 'Queue Performance'
      },
    }
  });
