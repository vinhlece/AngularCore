import {Directive, ElementRef, Input} from '@angular/core';
import anime from 'animejs';

@Directive({
  selector: '[appTwinkle]'
})
export class TwinkleDirective {
  private _el: ElementRef;

  @Input() color: string;

  constructor(el: ElementRef) {
    this._el = el;
  }

  trigger(option?: string) {
    const color = this.hexToRgb(this.color);
    if (option && option === 'dashed') {
      anime({
        targets: this._el.nativeElement,
        border: '1px dashed',
        borderColor: [
          {value: 'rgb(16,42,58)', duration: 1000},
          {value: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`, duration: 1000}
        ]
      });
    } else {
      anime({
        targets: this._el.nativeElement,
        border: [
          {value: '3px solid rgb(16,42,58)', duration: 1000},
          {value: '3px solid white', duration: 1000},
        ]
      });
    }
  }

  private hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const defaultRgb = {r: 0, g: 0, b: 0, a: 0};
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 1
      }
      : defaultRgb;
  }
}
