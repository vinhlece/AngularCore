import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectorRef, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {EventViewerWidget} from '../../../widgets/models';
import {Dimension, REPStyles, WidgetMouseEvent} from '../../models';
import {Measure} from '../../../measures/models/index';
import {EventViewerService} from './event-viewer.service';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-event-viewer',
  templateUrl: './event-viewer.component.html',
  styleUrls: ['./event-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EventViewerService]
})
export class EventViewerComponent implements OnInit {
  readonly MAX_EVENTS = 50;

  @Input() widget: EventViewerWidget; 

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
  eventCountSubscription: any;
  count: number;
  eventsPaused: any;
  disconnected: boolean;
  connectionSubscription: Subscription;

  constructor(private eventViewerService: EventViewerService, private changeDet: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscribeForEvents();
  }

  subscribeForEvents() {
    this.eventViewerService.connect();

    this.countEvents();
    this.getEvents();
    this.connectionEvents();
  }

  unsubscribeEvents() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
    if (this.eventCountSubscription) {
      this.eventCountSubscription.unsubscribe();
    }
  }

  private getEvents() {
    if (this.eventSubscription) this.eventSubscription.unsubscribe();

    this.eventSubscription = this.eventViewerService.getEvents()
    .pipe(
      takeWhile(() => !this.eventsPaused)
    )
    .subscribe(data => {
      data = JSON.parse(data);
      data.created = new Date(Date.now());
      data.created = data.created.toString().substring(0, 34);
      if (this.events.length >= this.MAX_EVENTS) {
        this.events.pop();
      }
      this.events.splice(0,0, data);
      this.changeDet.detectChanges();
    });
  }

  private countEvents() {
    if (this.eventCountSubscription) this.eventCountSubscription.unsubscribe();

    this.eventCountSubscription = this.eventViewerService.getEventCount()
    .pipe(
      takeWhile(() => !this.eventsPaused)
    ) 
    .subscribe(data => {
      this.count = data + 1;
      this.changeDet.detectChanges();
    });
  }

  private connectionEvents() {
    // Listen for connection events via stomp
    this.connectionSubscription = this.eventViewerService.getConnectionEvents().subscribe(data => {
      if (data === 'DISCONNECTED') {
        this.events = [];
        this.disconnected = true;
        this.eventsPaused = false;
      }
      this.changeDet.detectChanges();
    });
  }

  reconnect() {
    this.disconnected = false;
    this.events = [];
    this.subscribeForEvents();
  }

  disconnectTest() {
    this.eventViewerService.disconnect();
  }

  clearEvents() {
    this.events = [];
    this.eventViewerService.resetEventCount();
  }

  pauseEvents() {
    this.eventsPaused = !this.eventsPaused;
    if (!this.eventsPaused) {
      this.subscribeForEvents();
    } else {
      this.unsubscribeEvents();
    }
  }

  /**
   * Switch back to show live events
   */
  showLiveEvents() {
    this.liveEvents = true;
  }

  handleMouseDown(event) { }

  handleDoubleClick(event: any) { }

  handleRightClick(event: any) { }

  ngOnDestroy() {
    this.unsubscribeEvents();
    this.eventViewerService.disconnect();
  }

}
