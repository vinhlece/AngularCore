import {Directive, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appContextMenuItem]'
})
export class ContextMenuItemDirective implements OnInit {
  private _el: ElementRef;
  private _renderer: Renderer2;

  constructor(el: ElementRef, renderer: Renderer2) {
    this._el = el;
    this._renderer = renderer;
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    this.createRipple(event);
  }

  ngOnInit() {
    this._renderer.addClass(this.getHostElement(), 'context-menu-item');
  }

  /** Returns the host DOM element. */
  getHostElement(): HTMLElement {
    return this._el.nativeElement;
  }

  private createRipple(event) {
    const ripple = this._renderer.createElement('div');
    this._renderer.addClass(ripple, 'context-menu-ripple');
    this._renderer.setStyle(ripple, 'top', event.offsetY + 'px');
    this._renderer.setStyle(ripple, 'left', event.offsetX + 'px');
    this._renderer.appendChild(this.getHostElement(), ripple);
    this._renderer.listen(ripple, 'animationend', () => this._renderer.removeChild(this.getHostElement(), ripple));
  }
}
