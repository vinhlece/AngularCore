import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {EventStream} from '../../models/index';

@Component({
  selector: 'app-event-data',
  templateUrl: './event-data.component.html',
  styleUrls: ['./event-data.component.scss']
})
export class EventDataComponent implements OnInit, OnChanges {
  private _fb: FormBuilder;
  private _selectedIndex: string;

  @Input() streams: any;
  @Output() getStream = new EventEmitter<string>();
  @Output() onEventStream = new EventEmitter<{[source: string]: EventStream[]}>();
  @Output() updateStream = new EventEmitter<any>();
  showDetail = false;
  eventSources = [];
  form: FormGroup;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.addDefaultEvent();
    this.patch();
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const newStreams = changes['streams'];
    if (newStreams && newStreams.currentValue !== newStreams.previousValue && this.form) {
      const current = this.eventSources.find(i => i.source === this._selectedIndex);
      if (current && this.eventSources[this.eventSources.length - 1].source) {
        if (this.streams[this._selectedIndex]) {
          current.streams = this.streams[this._selectedIndex].map(value => false);
          current.isConnected = true;
          current.showDetail = true;
          current.isError = false;
          this.addDefaultEvent();
        } else {
          current.isError = true;
          current.streams = [];
        }
        this.patch();
      }
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  handleGetSourceStream(sourceId: number, inputValue: string = null) {
    let input = inputValue ? inputValue : this.form.get('input').value[sourceId].source;
    if (input) {
      input = input.trim();
    }
    if (input && this.eventSources.findIndex(i => i.source === input) < 0) {
      this._selectedIndex = input;
      this.eventSources[sourceId].source = input;
      this.getStream.emit(input);
    }
  }

  handleDeleteEventSource(index: number) {
    this.eventSources = [...this.eventSources.slice(0, index), ...this.eventSources.slice(index + 1)];
    this.removeAtIndex(index);
  }

  onStreamChange(event: any, index: number) {
    if (event.checked) {
      const selectedStreams = this.getSelectedStreamsName();
      this.onEventStream.emit(selectedStreams);
    }
  }

  getSelectedStreamsName() {
    const formValue = this.form.get('input').value;
    const streams = {};
    for (let i = 0; i < formValue.length; i++) {
      const newStreams = [];
      for (let j = 0; j < formValue[i].streams.length; j++) {
        if (formValue[i].streams[j] === true) {
          const tempSource = this.streams[formValue[i].source][j];
          newStreams.push({id: tempSource.id, name: tempSource.name});
        }
      }
      if (newStreams.length > 0) {
        streams[formValue[i].source] = newStreams;
      }
    }
    return streams;
  }

  private _propagateChange = (_: any) => {
    // no op
  }

  private patch() {
    if (this.form) {
      const current = this.form.get('input').value;
      for (let i = 0; i < this.eventSources.length; i++) {
        if (current[i] && this.eventSources[i].source === current[i].source) {
          this.eventSources[i].streams = current[i].streams.length ? current[i].streams : this.eventSources[i].streams;
        }
      }
    }
    this.form = this._fb.group({
      input: this._fb.array([])
    });
    const control = <FormArray>this.form.get('input');
    this.eventSources.forEach(x => {
      control.push(this.patchValues(x.source, x.streams));
    });
  }

  private removeAtIndex(index: number) {
    const control = <FormArray>this.form.get('input');
    control.removeAt(index);
  }

  private patchValues(source: string, streams: boolean[]) {
    return this._fb.group({
      source: this._fb.control(source),
      streams: this._fb.array(streams)
    });
  }

  private addDefaultEvent() {
    this.eventSources.push({ source: '', streams: [], isConnected: false, showDetail: false });
  }

  handleOpenEditStream(event, stream) {
    const streams = this.streams[event.source];
    this.streams[event.source] = streams.map(st => {
      if (st.id === stream.id) {
        return { ...st, isEdit: true };
      }
      return { ...st, isEdit: false };
    });
  }

  handleUpdateStream(event, stream, inputStream) {
    const { isEdit, ...infoStream } = stream;
    infoStream.name = inputStream.value;
    this.updateStream.emit({ event, stream: infoStream });
  }

  getSelectedStreams(index: number) {
    const selectedStreams = this.form.get('input').value[index].streams;
    return selectedStreams.filter(stream => stream).length;
  }
}
