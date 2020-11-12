import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {Subject} from 'rxjs/index';
import {EventMapping, EventStream, EventTag} from '../../models/index';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {WidgetWindow} from '../../../widgets/models/index';
import {uuid} from '../../../common/utils/uuid';
import * as _ from 'lodash';
import {ThemeService} from '../../../theme/theme.service';

@Component({
  selector: 'app-measure-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeasureSideBarComponent implements OnInit {
  private _fb: FormBuilder;
  private _loadedEventQualifiers: string[] = [];
  private _themeService: ThemeService;

  @ViewChild('tabGroup') tabGroup;
  @Input() streams: any;
  @Input() packages: any;
  @Input() windows: WidgetWindow[];
  @Input() existEventTags: EventTag[];
  @Input() eventTags: EventTag[];
  @Output() getStream = new EventEmitter<string>();
  @Output() updateStream = new EventEmitter<string>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onEventQualifier = new EventEmitter<any>();
  @Output() onEventStream = new EventEmitter<string>();
  @Output() onUpdateEventQualifier = new EventEmitter<any>();
  @Output() onDeleteEventQualifier = new EventEmitter<any>();

  isEventTagTab: boolean;
  addEvent: Subject<boolean> = new Subject<boolean>();
  eventStreams: {[source: string]: EventStream[]} = {};
  form: FormGroup;
  get allEventTags() { return _.union(this.eventTags, this.existEventTags); }

  constructor(fb: FormBuilder, public translate: TranslateService, themeService: ThemeService) {
    this._fb = fb;
    this._themeService = themeService;
  }

  ngOnInit() {
    this.createForm();
  }

  onTabChanged() {
    this.isEventTagTab = this.tabGroup.selectedIndex === 1;
  }

  handleGetStream(source: string) {
    this.getStream.emit(source);
  }

  handleUpdateStream(stream: any) {
    this.updateStream.emit(stream);
  }

  handleEventStream(eventStreams: {[source: string]: EventStream[]}) {
    this.eventStreams = eventStreams;
    const diff = _.difference(Object.keys(eventStreams), this._loadedEventQualifiers);
    if (diff.length > 0) {
      this._loadedEventQualifiers.push(...diff);
      this.onEventStream.emit(diff[0]);
    }
  }

  addCustomEvent() {
    this.addEvent.next(true);
  }

  handleSaveCustomEvent(event: any) {
    this.onEventQualifier.emit(event);
  }

  handleUpdateCustomEvent(event: any) {
    this.onUpdateEventQualifier.emit(event);
  }

  handleDeleteCustomEvent(event: any) {
    this.onDeleteEventQualifier.emit(event);
  }

  getButtonText(): string {
    if (this.isMeasureTab()) {
      return this.translate.instant('measure_specification.side_bar.save');
    }
    return this.translate.instant('measure_specification.side_bar.next');
  }

  handleSubmit() {
    if (this.isMeasureTab()) {
      const data = {
        measure: this.form.value.measure,
        mapping: this.createEventMapping()
      };
      this.onSubmit.emit(data);
    } else {
      this.tabGroup.selectedIndex = this.tabGroup.selectedIndex + 1;
    }
  }

  isDisabled() {
    return this.form.invalid && this.isMeasureTab();
  }

  createEventMapping(): {[source: string]: EventMapping[]} {
    const measures = this.form.value.measure;
    const eventMappings = {};
    Object.keys(this.eventStreams).forEach(source => {
      eventMappings[source] = [];
      this.eventStreams[source].forEach(stream => {
        measures.events.forEach(measure => {
          const eventMapping = {
            id: uuid(),
            name: measures.measureName + 'Mappings',
            eventStreamId: stream.id,
            qualifierNames: [measure.eventName],
            mapping: measures.dimensions[0].map(dimension =>
              ({
                sourceName: `body.eventdata.${dimension}`,
                targetName: dimension,
                measureDataType: 'DIMENSION'
              })
            )
          };
          eventMappings[source].push(eventMapping);
        });
      });
    });
    return eventMappings;
  }

  private createForm() {
    this.form = this._fb.group({
      measure: this._fb.control(null)
    });
  }

  private isMeasureTab(): boolean {
    return this.tabGroup && this.tabGroup.selectedIndex === 2;
  }
}
