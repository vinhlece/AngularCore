import {sandboxOf} from 'angular-playground';
import {EditFormulaMeasureFormComponent} from './edit-formula-measure-form.component';
import {MatButtonModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatSelectModule} from '@angular/material';
import * as mockPackage from '../../../common/testing/mocks/mockPackages';
import {mockFormulaMeasure} from '../../../common/testing/mocks/mockMeasures';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';

export default sandboxOf(EditFormulaMeasureFormComponent, {
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatChipsModule,
  ],
  declarations: [
    EditFormulaMeasureFormComponent
  ]
})
  .add('EditFormulaMeasureFormComponent', {
  template: `<app-edit-formula-measure-form
             [formulaMeasure]="measure"
             [allMeasureNames]="measureNames"
             [packages]="packages"></app-edit-formula-measure-form>`,
  context: {
    measure: mockFormulaMeasure(),
    packages: mockPackage.getAll(),
    measureNames: [],
  }
});
