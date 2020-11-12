import {Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-value-label',
  templateUrl: './value-label.component.html',
  styleUrls: ['./value-label.component.scss']
})
export class ValueLabelComponent implements OnInit {
  private _el: ElementRef;

  parent: any;

  @Input() value: string | number;
  @Input() color: string;

  constructor(el: ElementRef) {
    this._el = el;
  }

  ngOnInit() {
    let node = this._el.nativeElement.parentNode;
    while (!this.parent) {
      if (node.classList.contains('chart-container')) {
        this.parent = node;
      } else {
        node = node.parentNode;
      }
    }
  }
}
