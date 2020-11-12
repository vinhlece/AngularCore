import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges
} from '@angular/core';
import {Subject, Subscription} from 'rxjs/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EventQualifier, EventStream, EventTag} from '../../models/index';
import {EventTagService} from '../../services/event-tag/event-tag.service';
import {EditingEventTag} from '../../models/enums';

@Component({
  selector: 'app-event-tags',
  templateUrl: './event-tags.component.html',
  styleUrls: ['./event-tags.component.scss']
})
export class EventTagsComponent implements OnInit, OnDestroy, OnChanges {
  private _backupEventTags: any = {events: [], customs: []};
  private _subscription: Subscription = null;
  private _fb: FormBuilder;
  private currentEditingEvent: number;
  private _eventTagService: EventTagService;
  private _customEvents: EventTag[] = [];
  private _searchText: string;

  @Input() addEvent: Subject<boolean>;
  @Input() currentEventSource: {[source: string]: EventStream[]};
  @Input() existEventTags: EventTag[] = [];
  @Input()
  get customEvents(): EventTag[] {
    return this._customEvents;
  }
  set customEvents(custom: EventTag[]) {
    this._backupEventTags.customs = custom;
    this.handleSearchEvent(this._searchText);
  }
  @Output() onAddCustomEvent: EventEmitter<any> = new EventEmitter();
  @Output() onEditCustomEvent: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteCustomEvent: EventEmitter<any> = new EventEmitter();
  isAddEvent: boolean = false;
  displayEventList: boolean = false;
  toggleEventList: boolean = true;
  toggleEventQualifier: boolean = true;
  isSimpleList: boolean = true;
  isSimpleListEQ: boolean = true;
  isValidQuery: boolean = true;
  editingEvent: EditingEventTag = null;
  form: FormGroup;
  get editingEventTag() { return EditingEventTag; }
  get getEventSource() {
    if (!this.currentEventSource) { return []; }
    return Object.keys(this.currentEventSource);
  }

  constructor(fb: FormBuilder, eventTagService: EventTagService) {
    this._fb = fb;
    this._eventTagService = eventTagService;
  }

  ngOnInit() {
    if (this.addEvent) {
      this._subscription = this.addEvent.subscribe(show => {
        this.displayEventList = false;
        this.isAddEvent = show;
      });
    }

    this.form = this._fb.group({
      input: [null, [Validators.required]],
      query: [null, [Validators.required]]
    });
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const eventTags = changes['existEventTags'];
    if (eventTags && eventTags.currentValue !== eventTags.previousValue) {
      this._backupEventTags.events = this.existEventTags;
    }
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  saveCustomEvent() {
    if (this.form.invalid || this.getEventSource.length === 0) {
      return;
    }
    const name = this.form.get('input').value;
    const index = this._backupEventTags.customs.findIndex(item => item.name === name);
    if (index >= 0 && index !== this.currentEditingEvent) { return; }
    const query = this.form.get('query').value;
    const data = { name, query };
    const eventQualifier = this.parseEventQuery(data);
    this.isValidQuery = eventQualifier.parameters.length > 0;
    if (!this.isValidQuery) {
      return;
    }
    const eventTag = {url: this.getEventSource[0], eventQualifier, query};
    if (this.editingEvent) {
      eventTag.eventQualifier.id = this.getEventTagId(this.currentEditingEvent);
      if (!eventTag.eventQualifier.id) {
        return;
      }
      this.onEditCustomEvent.emit({...eventTag, editingEvent: this.editingEvent});
    } else {
      this.onAddCustomEvent.emit(eventTag);
    }
    this.displayEventList = true;
    this.clearEvent();
  }

  getEventsName() {
    return this.existEventTags.map(event => event.name);
  }

  getEventsCustomName() {
    return this.customEvents.map(event => event.name);
  }

  clearEvent() {
    this.clearInput();
    this.displayEventList = true;
    this.isValidQuery = true;
    this.editingEvent = null;
  }

  getIconClass() {
    if (this.form.invalid) {
      return 'disabled';
    }
  }

  hideAddForm() {
    this.toggleEventList = !this.toggleEventList;
  }

  handleSearchEvent(event: string) {
    this._searchText = event;
    const reg: RegExp = new RegExp(event, 'i');
    this._customEvents = this._backupEventTags.customs.filter(item => reg.test(item.name));
    this.existEventTags = this._backupEventTags.events.filter(item => reg.test(item.name));
  }

  handleSwitchMode() {
    this.isSimpleList = !this.isSimpleList;
  }

  handleDeleteEvent(event: EventTag, editingEvent: EditingEventTag) {
    if (event.id && this.getEventSource.length > 0) {
      this.onDeleteCustomEvent.emit({url: this.getEventSource[0], id: event.id, editingEvent});
    }
  }

  handleEditEvent(index: number, event: EventTag, editingEventTag: EditingEventTag) {
    this.editingEvent = editingEventTag;
    this.currentEditingEvent = index;
    this.setInputValue(event);
  }

  private getEventTagId(index: number): string {
    let current = null;
    if (this.editingEvent === EditingEventTag.OnCustom) {
      current = this._customEvents[index];
    } else if (this.editingEvent === EditingEventTag.OnEvent) {
      current = this.existEventTags[index];
    }
    return current && current.id;
  }

  private parseEventQuery(eventTag: EventTag): EventQualifier {
    const parameters = this._eventTagService.extract(eventTag.query);
    return {
      id: eventTag.id ? eventTag.id : '',
      name: eventTag.name,
      operator: 'ALL',
      parameters
    };
  }

  private clearInput() {
    this.form.get('input').reset();
    this.form.get('query').reset();
  }

  private setInputValue(event: EventTag) {
    this.form.get('input').patchValue(event.name);
    this.form.get('query').patchValue(event.query);
  }

  private _propagateChange = (_: any) => {
    // no op
  }
}
