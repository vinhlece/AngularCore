import {NgModule} from '@angular/core';
import {ThemeService} from './theme.service';
import {ThemeDirective} from './theme.directive';

@NgModule({
  imports: [],
  providers: [ThemeService],
  declarations: [ThemeDirective],
  exports: [ThemeDirective]
})
export class ThemeModule {}
