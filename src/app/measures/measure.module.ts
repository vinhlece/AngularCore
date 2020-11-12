import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {RouterModule} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {ColorPickerModule} from 'ngx-color-picker';
import {ChartsModule} from '../charts/charts.module';
import {LayoutModule} from '../layout/layout.module';
import {AuthenticatedGuardService} from '../user/services/auth/authenticated-guard.service';
import {EditFormulaMeasureFormComponent} from './components/edit-formula-measure-form/edit-formula-measure-form.component';
import {MeasureFormComponent} from './components/measure-form/measure-form.component';
import {MeasuresComponent} from './components/measures/measures.component';
import {AddFormulaMeasureContainer} from './containers/add-formula-measure/add-formula-measure.container';
import {AddMeasureContainer} from './containers/add-measure/add-measure.container';
import {EditMeasureContainer} from './containers/edit-measure/edit-measure.container';
import {MeasuresContainer} from './containers/measures/measures.container';
import {FormulaMeasureEffects} from './effects/formula-measure.effect';
import {MeasuresEffects} from './effects/measures.effects';
import {PackagesEffects} from './effects/packages.effects';
import {reducers} from './reducers';
import {FormulaMeasureFactoryImpl} from './services/formula/formula-measure.service';
import {PackagesServiceImpl} from './services/http/packages.service';
import {FORMULA_MEASURE_FACTORY, PACKAGES_SERVICE} from './services/tokens';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSidenavModule,
    MatChipsModule,
    MatRadioModule,
    LayoutModule,
    ChartsModule,
    ColorPickerModule,
    RouterModule.forChild([
      {path: 'measures/new', component: AddMeasureContainer, canActivate: [AuthenticatedGuardService]},
      {path: 'measures', component: MeasuresContainer, canActivate: [AuthenticatedGuardService]},
      {path: 'measures/:id/edit', component: EditMeasureContainer, canActivate: [AuthenticatedGuardService]},
      {path: 'measures/add_formula', component: AddFormulaMeasureContainer, canActivate: [AuthenticatedGuardService]}
    ]),
    StoreModule.forFeature('measures', reducers),
    EffectsModule.forFeature([
      PackagesEffects,
      MeasuresEffects,
      FormulaMeasureEffects
    ]),
    TranslateModule,
    ThemeModule
  ],
  declarations: [
    MeasuresComponent,
    MeasureFormComponent,
    MeasuresContainer,
    EditMeasureContainer,
    AddMeasureContainer,
    EditFormulaMeasureFormComponent,
    AddFormulaMeasureContainer,
  ],
  exports: [
    AddFormulaMeasureContainer
  ],
  providers: [
    {
      provide: PACKAGES_SERVICE,
      useClass: PackagesServiceImpl,
    },
    {
      provide: FORMULA_MEASURE_FACTORY,
      useClass: FormulaMeasureFactoryImpl
    },
  ],
})
export class MeasuresModule {

}
