import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-invoke-url-output',
  templateUrl: './invoke-url-output.component.html',
  styleUrls: ['./invoke-url-output.component.scss']
})
export class InvokeUrlOutputComponent {
  private _message: string;

  @Input() hasError: boolean;

  @Input()
  set data(value) {
    if (value) {
      this._message = typeof value === 'object' ? JSON.stringify(value) : value;
    }
  }

  get message(): string {
    return this._message;
  }
}
