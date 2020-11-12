import {of} from 'rxjs';
import {ZoomEvent} from '../../../charts/models';
import * as timePreferencesActions from '../../actions/time-preferences.actions';
import {ZoomOnLine} from './zoom-behaviors';

describe('Zoom Behavior', () => {
  let store;

  beforeEach(() => {
    store = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
  });

  describe('can zoom', () => {
    describe('zoom by drag', () => {
      it('should dispatch trigger zoom action for zoom trigger', () => {
        const event: ZoomEvent = {
          trigger: 'zoom',
          rangeSelectorButton: null
        };
        const expected = new timePreferencesActions.TriggerZoom(event);
        const behavior = new ZoomOnLine(store);
        behavior.zoom(event);
        expect(store.dispatch).toHaveBeenCalledWith(expected);
      });

      it('should dispatch trigger zoom action for navigator trigger', () => {
        const event: ZoomEvent = {
          trigger: 'navigator',
          rangeSelectorButton: null
        };
        const expected = new timePreferencesActions.TriggerZoom(event);
        const behavior = new ZoomOnLine(store);
        behavior.zoom(event);
        expect(store.dispatch).toHaveBeenCalledWith(expected);
      });
    });

    describe('zoom by range selector button', () => {
      it('should do nothing if we do not select a different range selector button', () => {
        const event: ZoomEvent = {
          trigger: 'rangeSelectorButton',
          rangeSelectorButton: '1d'
        };
        const zoom$ = of(event);
        store.pipe.and.returnValue(zoom$);

        const behavior = new ZoomOnLine(store);
        behavior.zoom(event);

        expect(store.dispatch).not.toHaveBeenCalled();
      });

      it('should dispatch trigger zoom action if select range selector button (except All) the first time', () => {
        const event: ZoomEvent = {
          trigger: 'rangeSelectorButton',
          rangeSelectorButton: '1d'
        };
        const expected = new timePreferencesActions.TriggerZoom(event);
        const zoom$ = of({
          trigger: 'rangeSelectorButton',
          rangeSelectorButton: '2m'
        });
        store.pipe.and.returnValue(zoom$);

        const behavior = new ZoomOnLine(store);
        behavior.zoom(event);

        expect(store.dispatch).toHaveBeenCalledWith(expected);
      });

      it('should dispatch reset zoom action if select All range selector button the first time', () => {
        const event: ZoomEvent = {
          trigger: 'rangeSelectorButton',
          rangeSelectorButton: 'All'
        };
        const expected = new timePreferencesActions.ResetZoom();
        const zoom$ = of({
          trigger: 'rangeSelectorButton',
          rangeSelectorButton: '1d'
        });
        store.pipe.and.returnValue(zoom$);

        const behavior = new ZoomOnLine(store);
        behavior.zoom(event);

        expect(store.dispatch).toHaveBeenCalledWith(expected);
      });
    });
  });
});
