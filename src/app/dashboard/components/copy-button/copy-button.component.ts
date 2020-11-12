import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-copy-button',
  templateUrl: './copy-button.component.html',
  styleUrls: ['./copy-button.component.scss']
})
export class CopyButtonComponent {
  @Input() description: string;

  @Output() onCopy: EventEmitter<void > = new EventEmitter();

  @ViewChild('tooltip') tooltip: MatTooltip;

  handleCopy() {
    this.onCopy.emit();
    // this.tooltip.message = 'Widget copied to clipboard';
    // this.tooltip.show();
  }

  handleMouseEnter() {
    // this.tooltip.message = this.description;
  }
}
