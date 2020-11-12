import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import { Observable, interval, Subscription } from 'rxjs';
import { EventViewerService } from './../../../services/event-viewer.service';
import {ThemeService} from '../../../../../theme/theme.service';

/**
 * Displays event viewer for a selected stream.  Shows events on the stream via live-events.
 */
@Component({
  selector: 'app-event-viewer',
  templateUrl: './event-viewer.component.html',
  styleUrls: ['./event-viewer.component.scss'],
  providers: [EventViewerService]
})
export class EventViewerComponent implements OnInit, OnChanges {

  readonly MAX_EVENTS = 20;
  readonly msg = 'Subscribing For Events'

  @Input() streamName: string;

  // streams: string[] = ['Agent Login Events', 'Connect Events'];
  eventProps: string[];
  storedEvents = [];
  events = [];
  mockData = [];

  eventSubscription: Subscription;
  eventMap: Map<string, string> = new Map<string, string>();

  showFormatted = false;
  showId: any;
  currentEvents: any[];
  liveEvents: boolean = true;

  constructor(private eventViewerService: EventViewerService, private themeService: ThemeService) { }

  ngOnInit(): void {
    this.eventViewerService.connect();
    this.eventSubscription = this.eventViewerService.getEvents().subscribe(data => {
      data = JSON.parse(data);
      data.created = new Date(Date.now());
      data.created = data.created.toString().substring(0, 34);
      if (this.events.length >= this.MAX_EVENTS) {
        this.events.pop();
      }
      this.events.splice(0,0, data);
    })
  }

  ngOnChanges(changes: SimpleChanges): void { }

  clearEvents() {
    this.events = [];
    this.showId = undefined;
    this.showFormatted = false;
  }

  /**
   * Store event user has starred 
   * called via emitter on live-event
   */
  handleStoreEvent(ev) {
    this.storedEvents.push(ev);
  }

  /**
   * Show events user has starred
   */
  showStoredEvents() {
    console.log('showStoredEvents()', this.liveEvents);
    // if not showing live events switch back to live events
    if (!this.liveEvents) {
      this.events = this.currentEvents;
    } else {
      this.currentEvents = this.events;
      this.events = this.storedEvents;
    }
    this.liveEvents = !this.liveEvents;
    console.log('showStoredEvents() - exit', this.liveEvents);
  }

  /**
   * Switch back to show live events
   */
  showLiveEvents() {
    console.log('showLiveEvents()', this.liveEvents);
    this.liveEvents = true;
  }

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}
