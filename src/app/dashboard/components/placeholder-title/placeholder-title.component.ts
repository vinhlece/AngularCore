import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input, OnChanges, OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {isNullOrUndefined, isUndefined} from 'util';
import {TextAlignment} from '../../models/enums';

@Component({
  selector: 'app-placeholder-title',
  templateUrl: './placeholder-title.component.html',
  styleUrls: ['./placeholder-title.component.scss']
})
export class PlaceholderTitleComponent implements OnInit, OnChanges {
  private _fb: FormBuilder;
  private _title: string;

  @Input()
  get title(): string {
    return this._title;
  }
  set title(value: string) {
    this._title = value;
    this.editable = false;
  }

  editable: boolean = false;
  form: FormGroup;
  @Input() isSubTitle: Boolean;
  @Input() titlePosition: string;
  @Input() isOverlayWidget: boolean
  @Output() onSubmit = new EventEmitter<string>();
  @ViewChild('inputTitle') input: ElementRef;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  @HostListener('dblclick')
  handleDblClick() {
    if (!this.isOverlayWidget) {
      this.toggleEditMode();
    }
  }

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges() {
    this.setValue();
  }

  getTitleStyle() {
    const align = {
      textAlign: `${this.titlePosition ? this.titlePosition.toLowerCase() : 'left'}`,
      paddingRight: '17px'
    };
    if (this.titlePosition === TextAlignment.Center) {
      return {...align, paddingLeft: '17px'};
    }
    return align;
  }

  toggleEditMode() {
    this.editable = true;
    // Waiting input element is ready
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 100);
  }

  handleCancel() {
    this.editable = false;
    this.setValue();
  }

  submit() {
    const newTitle = this.form.value.title;
    this.onSubmit.emit(newTitle);
  }

  private createForm() {
    this.form = this._fb.group({
      title: [this.title]
    });
  }

  private setValue() {
    if (this.form) {
      if (isUndefined(this.title)) {
        this.form.setValue({title: null});
      } else {
        this.form.setValue({title: this.title});
      }
    }
  }
}
