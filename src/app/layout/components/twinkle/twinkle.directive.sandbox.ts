import {Component, ViewChild} from '@angular/core';
import {MatButtonModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {TwinkleDirective} from './twinkle.directive';

@Component({
  selector: 'app-test-twinkle',
  template: `
    <div class="box" appTwinkle></div>
    <button mat-raised-button color="accent" (click)="handleClick()">Twinkle</button>
  `,
  styles: [
      `
      .box {
        width: 512px;
        height: 512px;
        background-color: white;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
      }
    `
  ]
})
class TestTwinkleComponent {
  @ViewChild(TwinkleDirective) twinkle: TwinkleDirective;

  handleClick() {
    this.twinkle.trigger();
  }
}

export default sandboxOf(TestTwinkleComponent, {
  imports: [MatButtonModule],
  declarations: [TwinkleDirective]
})
  .add('twinkle animation', {
    template: `<app-test-twinkle></app-test-twinkle>`,
  });
