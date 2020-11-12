import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {RouterModule} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {ContextMenuItemDirective} from './components/context-menu/context-menu-item.directive';
import {ContextMenuComponent} from './components/context-menu/context-menu.component';
import {DroppableDirective} from './components/droppable/droppable.directive';
import {FitTextDirective} from './components/fit-text/fit-text.directive';
import {HeaderComponent} from './components/header/header.component';
import {LoadingBarComponent} from './components/loading-bar/loading-bar.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {TwinkleDirective} from './components/twinkle/twinkle.directive';
import {HeaderContainerComponent} from './containers/header-container/header-container.component';
import {NavigationEffects} from './effects/navigation.effects';
import {reducers} from './reducers';
import {mainRoute} from './routes';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import {TextInputComponent} from './components/text-input/text-input.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchBoxComponent} from './components/search-box/search-box.component';
import { SearchListComponent } from './components/search-list/search-list.component';
import {ThemeModule} from '../theme/theme.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ProgressSpinnerComponent} from './components/progress-spinner/progress-spinner.component';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatInputModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('layout', reducers),
    RouterModule.forChild(mainRoute),
    EffectsModule.forFeature([NavigationEffects]),
    HttpClientModule,
    TranslateModule,
    MatChipsModule,
    ThemeModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    HeaderComponent,
    HeaderContainerComponent,
    LoadingBarComponent,
    ContextMenuComponent,
    SidebarComponent,
    ContextMenuItemDirective,
    DroppableDirective,
    TwinkleDirective,
    FitTextDirective,
    TextInputComponent,
    SearchBoxComponent,
    SearchListComponent,
    ProgressSpinnerComponent
  ],
  exports: [
    HeaderComponent,
    HeaderContainerComponent,
    LoadingBarComponent,
    ContextMenuComponent,
    SidebarComponent,
    ContextMenuItemDirective,
    DroppableDirective,
    TwinkleDirective,
    FitTextDirective,
    TextInputComponent,
    SearchBoxComponent,
    SearchListComponent,
    ProgressSpinnerComponent
  ]
})
export class LayoutModule {
}
