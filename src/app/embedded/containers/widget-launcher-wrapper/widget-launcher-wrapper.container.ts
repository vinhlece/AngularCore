import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {Dimension, REPStyles} from '../../../charts/models';
import * as placeholdersActions from '../../../dashboard/actions/placeholders.actions';
import {Placeholder} from '../../../dashboard/models';
import * as fromDashboards from '../../../dashboard/reducers';
import * as embeddedActions from '../../actions/embedded.actions';
import * as fromEmbedded from '../../reducers';

@Component({
  selector: 'app-widget-launcher-wrapper',
  templateUrl: './widget-launcher-wrapper.container.html',
  styleUrls: ['./widget-launcher-wrapper.container.scss']
})
export class WidgetLauncherWrapperContainer implements OnInit {
  private _store: Store<fromEmbedded.State>;
  private _el: ElementRef;
  private _styles: REPStyles = {backgroundColor: '#ffffff', color: '#333', font: 'Poppins'};

  placeholder$: Observable<Placeholder>;

  @Input() placeholderId: string;

  @Input()
  set backgroundColor(value: string) {
    this._styles = {
      ...this.styles,
      backgroundColor: value === 'inherit' ? this.toHex(this.parentStyles().backgroundColor) : value
    };
  }

  @Input()
  set color(value: string) {
    this._styles = {
      ...this.styles,
      color: value === 'inherit' ? this.toHex(this.parentStyles().color) : value
    };
  }

  @Input()
  set font(value: string) {
    this._styles = {
      ...this.styles,
      font: value === 'inherit' ? this.parentStyles().fontFamily : value
    };
  }

  constructor(store: Store<fromEmbedded.State>, el: ElementRef) {
    this._store = store;
    this._el = el;
  }

  ngOnInit() {
    this._store.dispatch(new embeddedActions.StartSession());
    this._store.dispatch(new embeddedActions.SetLauncherSize({id: this.placeholderId, size: this.getSize()}));
    this._store.dispatch(new placeholdersActions.Load(this.placeholderId));

    this.placeholder$ = this._store.pipe(select(fromDashboards.getPlaceholderById(this.placeholderId)));
  }

  get styles(): REPStyles {
    return this._styles;
  }

  private parentStyles(): CSSStyleDeclaration {
    return window.getComputedStyle(this._el.nativeElement.parentNode);
  }

  private toHex(rgb: string): string {
    const regex = /rgba?\(([0-9]+),\s?([0-9]+),\s?([0-9]+)(,\s?([0-9]+))?\)/;
    const tokens = regex.exec(rgb);
    return this.rgbToHex(+tokens[1], +tokens[2], +tokens[3]);
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  private getSize(): Dimension {
    const width = this._el.nativeElement.clientWidth;
    const height = this._el.nativeElement.clientHeight - 32;
    return {width, height};
  }
}
