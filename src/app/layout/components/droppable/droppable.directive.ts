import {Directive, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

declare let $: any;

export interface DropEvent {
  target: HTMLElement;
  value: any;
}

@Directive({
  selector: '[appDroppable]'
})
export class DroppableDirective implements OnInit {
  private _el: ElementRef;

  /** Class name of the draggable element which is accepted by the host element */
  @Input() accept: string;

  /** Notify when the draggable element is dropped */
  @Output() onDrop = new EventEmitter<DropEvent>();

  /** Notify when draggable element is over */
  @Output() onOver = new EventEmitter<DropEvent>();

  /** Notify when draggable element is out */
  @Output() onOut = new EventEmitter<DropEvent>();

  constructor(el: ElementRef) {
    this._el = el;
  }

  ngOnInit() {
    $(this.getHostElement()).droppable({
      accept: this.accept,
      drop: (event, ui) => {
        if (this.acceptable(ui)) {
          this.onDrop.emit(this.createDropEvent(ui));
        }
      },
      over: (event, ui) => {
        if (this.acceptable(ui)) {
          this.onOver.emit(this.createDropEvent(ui));
        }
      },
      out: (event, ui) => {
        if (this.acceptable(ui)) {
          this.onOut.emit(this.createDropEvent(ui));
        }
      }
    });
  }

  /** Returns the host DOM element. */
  private getHostElement(): HTMLElement {
    return this._el.nativeElement;
  }

  private acceptable(ui): boolean {
    return $(ui.helper).is(this.accept);
  }

  private createDropEvent(ui): DropEvent {
    return {
      value: ui.helper.data('app-droppable-data'),
      target: ui.helper.get(0)
    };
  }
}
