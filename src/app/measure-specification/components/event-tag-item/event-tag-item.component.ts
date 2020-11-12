import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventTag} from '../../models/index';

@Component({
  selector: 'app-event-tag-item',
  templateUrl: './event-tag-item.component.html',
  styleUrls: ['./event-tag-item.component.scss']
})
export class EventTagItemComponent implements OnInit {

  @Input() eventTag: EventTag;
  @Output() onDelete: EventEmitter<void> = new EventEmitter();
  @Output() onEdit: EventEmitter<void> = new EventEmitter();

  ngOnInit() {
  }

  handleEdit() {
    if (this.onEdit) {
      this.onEdit.emit();
    }
  }

  handleDelete() {
    if (this.onDelete) {
      this.onDelete.emit();
    }
  }
}
