import {sandboxOf} from 'angular-playground';
import {ContentOverlayComponent} from './content-overlay.component';

export default sandboxOf(ContentOverlayComponent, {})
  .add('should show overlay layer', {
    template: `<app-content-overlay></app-content-overlay>`
  });
