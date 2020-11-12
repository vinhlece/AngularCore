import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MeasureDefinitionContainer} from './containers/measure-definition/measure-definition.container';
import {RouterModule} from '@angular/router';
import {AuthenticatedGuardService} from '../user/services/auth/authenticated-guard.service';
import { MeasureSpecificationComponent } from './components/measure-specification/measure-specification.component';
import {LayoutModule} from '../layout/layout.module';
import {MeasureSideBarComponent} from './components/side-bar/side-bar.component';
import {MeasureSideBarContainer} from './containers/side-bar/side-bar.container';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventDataComponent } from './components/event-data/event-data.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import {MeasureComponent} from './components/measure/measure.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EventTagsComponent} from './components/event-tags/event-tags.component';
import {EventItemComponent} from './components/event-item/event-item.component';
import {StoreModule} from '@ngrx/store';
import {reducers} from './reducers/index';
import {EffectsModule} from '@ngrx/effects';
import {EventSourceEffects} from './effects/measure-specification.effect';
import {EVENT_SOURCE_SERVICE} from './services/tokens';
import {FakeEventSourceServiceImpl} from './services/http/fake-event-source.service';
import { ChipListComponent } from './components/form/chip-list/chip-list.component';
import {EventTagItemComponent} from './components/event-tag-item/event-tag-item.component';
import {MetricTypePipe} from './utils/MetricTypePipe';
import {EventTagEffect} from './effects/event-tag.effect';
import {EventTagService} from './services/event-tag/event-tag.service';
import {environment} from '../../environments/environment';
import {EventSourceServiceImpl} from './services/http/event-source.service';
import {TranslateModule} from '@ngx-translate/core';
import { EventViewerModule } from './event-viewer/event-viewer.module';
import {ThemeModule} from '../theme/theme.module';


@NgModule({
  imports: [
    EventViewerModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LayoutModule,
    MatIconModule,
    FlexLayoutModule,
    MatTabsModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    RouterModule.forChild([
      {path: 'measuresDefinition', component: MeasureDefinitionContainer, canActivate: [AuthenticatedGuardService]},
    ]),
    StoreModule.forFeature('source', reducers),
    EffectsModule.forFeature([
      EventSourceEffects, EventTagEffect
    ]),
    TranslateModule,
    ThemeModule
  ],
  declarations: [
    MeasureDefinitionContainer,
    MeasureSpecificationComponent,
    MeasureSideBarComponent,
    MeasureSideBarContainer,
    EventDataComponent,
    MeasureComponent,
    MeasureSideBarContainer,
    EventTagsComponent,
    EventItemComponent,
    MeasureSideBarContainer,
    ChipListComponent,
    EventTagItemComponent,
    MetricTypePipe
  ],
  exports: [],
  providers: [
    EventTagService,
    environment.useFakeData
      ? {provide: EVENT_SOURCE_SERVICE, useClass: FakeEventSourceServiceImpl}
      : {provide: EVENT_SOURCE_SERVICE, useClass: EventSourceServiceImpl}
  ],
})
export class MeasuresSpecificationModule {

}
