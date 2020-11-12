import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatCardModule, MatIconModule, MatInputModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {SimpleNameFormComponent} from './simple-name-form.component';


export default sandboxOf(SimpleNameFormComponent, {
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule
  ]
})
  .add('display form with title without input data', {
  template: `<app-simple-name-form [formTitle]="formTitle" inputData="{}"></app-simple-name-form>`,
  context: {
    formTitle: 'New Tab',
    inputData: {}
  }
})
  .add('display form with a title with input data', {
  template: `<app-simple-name-form [formTitle]="formTitle" [inputData]="inputData" ></app-simple-name-form>`,
  context: {
    formTitle: 'Edit Tab',
    inputData: {name: 'Vardy'}
  }
});
