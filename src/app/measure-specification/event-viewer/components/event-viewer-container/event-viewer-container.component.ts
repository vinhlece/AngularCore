import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import { Observable, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-event-viewer-container',
  templateUrl: './event-viewer-container.component.html',
  styleUrls: ['./event-viewer-container.component.scss']
})
export class EventViewerContainerComponent implements OnInit, OnChanges {

  readonly MAX_EVENTS = 20;
  readonly msg = 'Subscribing For Events'

  streams: string[] = ['Agent Login Events', 'Connect Events'];
  eventProps: string[];
  storedEvents = [];
  events = [];
  mockData = [];

  eventSubscription: Subscription;
  eventMap: Map<string, string> = new Map<string, string>();

  showFormatted = false;
  showId: any;
  currentEvents: any[];
  liveEvents = true;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void { }

  /**
   * Store event user has starred 
   */
  storeEvent(event) {
    this.storedEvents.push(event);
  }

  /**
   * Show events user has starred
   */
  showStoredEvents() {
    console.log('showStoredEvents');
    // if not showing live events switch back to live events
    if (!this.liveEvents) {
      this.events = this.currentEvents;
    } else {
      this.currentEvents = this.events;
      this.events = this.storedEvents;
    }
    this.liveEvents = !this.liveEvents;
  }

  /**
   * Switch back to show live events
   */
  showLiveEvents() {
    this.liveEvents = true;
  }

  formatJson(json, id) {
    // this.eventProps = Object.keys(json);
    // this.eventProps.forEach((key) => {
    //   this.eventMap[key] = json[key];
    // });
    this.showFormatted = !this.showFormatted;
    this.showId = id;
  }

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}
