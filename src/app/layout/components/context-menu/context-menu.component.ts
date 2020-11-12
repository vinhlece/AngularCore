import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';

export interface ContextMenuEvent {
  type: string;
  target?: HTMLElement;
  clientX?: number;
  clientY?: number;
}

@Component({
  selector: 'app-context-menu',
  templateUrl: 'context-menu.component.html',
  styleUrls: ['context-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContextMenuComponent implements OnInit, OnDestroy {
  private _renderer: Renderer2;
  private _el: ElementRef;
  private _left: number;
  private _top: number;
  private _evt: ContextMenuEvent;

  /** Context menu will be closed when click on this element, default is document */
  private _defaultCloseTrigger: Document = document;
  private _defaultCloseTriggerListener: () => void;

  /**
   * The target element where context menu is fired,
   * this trigger is used to close context menu in case of the target element don't support event propagation
   */
  private _targetCloseTrigger: HTMLElement;
  private _targetCloseTriggerListener: () => void;

  /** Visibility of the context menu */
  visible: boolean = false;

  /** Top position of context menu relative to viewport */
  get top(): number {
    return this._top;
  }

  set top(value: number) {
    const height = this._el.nativeElement.getElementsByClassName('context-menu-item').length * 32 + 16;
    const viewportHeight = this.getViewportHeight();
    if (value + height <= viewportHeight) {
      this._top = value;
    } else {
      this._top = value - height;
    }
  }

  /** Left position of context menu relative to viewport */
  get left(): number {
    return this._left;
  }

  set left(value: number) {
    const width = 192;
    const viewportWidth = this.getViewportWidth();
    if (value + width <= viewportWidth) {
      this._left = value;
    } else {
      this._left = value - width;
    }
  }

  /** Native context menu event, or a MouseEvent which has type contextmenu */
  @Input()
  set event(e: ContextMenuEvent) {
    // Don't show context menu when event not exists
    if (!e) {
      this.visible = false;
      return;
    }

    this._evt = e;

    if (this._evt.type !== 'contextmenu') {
      throw new Error(`Event type must be contextmenu, the type ${event.type} is not accepted.`);
    }

    this.visible = true;

    if (this._evt.target) {
      this._targetCloseTrigger = this._evt.target as HTMLElement;
      this._targetCloseTriggerListener = this.addCloseEventFor(this._targetCloseTrigger);
    }

    setTimeout(() => {
      this.top = this._evt.clientY;
      this.left = this._evt.clientX;
    }, 0);
  }

  constructor(renderer: Renderer2, el: ElementRef) {
    this._renderer = renderer;
    this._el = el;
  }

  ngOnInit() {
    this._defaultCloseTriggerListener = this.addCloseEventFor(this._defaultCloseTrigger);
  }

  ngOnDestroy() {
    this.removeCloseEvents();
  }

  private addCloseEventFor(closeTrigger: HTMLElement | Document): () => void {
    return this._renderer.listen(closeTrigger, 'click', () => {
      this.visible = false;
    });
  }

  private removeCloseEvents() {
    if (this._defaultCloseTriggerListener) {
      this._defaultCloseTrigger.removeEventListener('click', this._defaultCloseTriggerListener, false);
    }
    if (this._targetCloseTriggerListener) {
      this._targetCloseTrigger.removeEventListener('click', this._targetCloseTriggerListener, false);
    }
  }

  private getViewportWidth(): number {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }

  private getViewportHeight(): number {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  }
}
