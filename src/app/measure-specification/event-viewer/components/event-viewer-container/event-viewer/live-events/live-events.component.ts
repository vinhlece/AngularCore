import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-live-events',
  templateUrl: './live-events.component.html',
  styleUrls: ['./live-events.component.scss']
})
export class LiveEventsComponent {

  @Input() events: any[];
  @Input() liveEvents = true;
  @Output() storeEvent: EventEmitter<any> = new EventEmitter();

  showFormatted: boolean;
  showId: string;

  handleStoreEvent(event) {
    this.storeEvent.emit(event);
  }

  formatJson(json, id) {
    this.showFormatted = !this.showFormatted;
    this.showId = id;
  }
}
