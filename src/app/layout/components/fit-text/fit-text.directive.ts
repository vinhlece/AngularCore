import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {ResizeSensor} from 'css-element-queries';

@Directive({
  selector: '[appFitText]'
})
export class FitTextDirective implements AfterViewInit {
  private _el: ElementRef;
  private _renderer: Renderer2;

  @Input() parent: HTMLElement;
  @Input() scale: number = 10;
  @Input() center: boolean;

  constructor(el: ElementRef, renderer: Renderer2) {
    this._el = el;
    this._renderer = renderer;
  }

  ngAfterViewInit() {
    const parent: HTMLElement = this.parent || this._el.nativeElement.parentNode;
    this.resize(parent);
    this.resizeSensor(parent);
  }

  private resizeSensor(element: HTMLElement) {
    return new ResizeSensor(element, () => this.resize(element));
  }

  private resize(element: HTMLElement) {
    this.setFontSize(element);
    if (this.center) {
      this.centerText();
    }
  }

  private setFontSize(parent: HTMLElement) {
    const width = parent.offsetWidth;
    const height = parent.offsetHeight;
    const fontSize = width < height ? width / this.scale : height / this.scale;
    this._renderer.setStyle(this._el.nativeElement, 'font-size', `${fontSize}px`);
  }

  private centerText() {
    const elWidth = this._el.nativeElement.offsetWidth;
    const elHeight = this._el.nativeElement.offsetHeight;
    this._renderer.setStyle(this._el.nativeElement, 'position', 'absolute');
    this._renderer.setStyle(this._el.nativeElement, 'top', `${-elHeight}px`);
    this._renderer.setStyle(this._el.nativeElement, 'left', `${-elWidth / 2}px`);
  }
}
