import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatBadgeModule } from "@angular/material/badge";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { EventViewerService } from "./services/event-viewer.service";
import { EventViewerComponent } from "./components/event-viewer-container/event-viewer/event-viewer.component";
import { EventViewerContainerComponent } from "./components/event-viewer-container/event-viewer-container.component";
import { LiveEventDirective } from "./components/live-event.directive";
import { LiveEventsComponent } from "./components/event-viewer-container/event-viewer/live-events/live-events.component";
import {ThemeModule} from '../../theme/theme.module';

@NgModule({
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatTooltipModule, MatBadgeModule, ThemeModule],
  declarations: [
      EventViewerContainerComponent,
      EventViewerComponent,
      LiveEventsComponent,
      LiveEventDirective
  ],
  exports: [EventViewerContainerComponent, LiveEventsComponent, LiveEventDirective]
})
export class EventViewerModule {

}
