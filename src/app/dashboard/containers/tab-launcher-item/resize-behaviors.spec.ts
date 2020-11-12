import createSpyObj = jasmine.createSpyObj;
import * as placeholdersActions from '../../actions/placeholders.actions';
import {ResizeBehaviorImpl} from './resize-behaviors';

describe('Resize Behavior', () => {
  let store;

  beforeEach(() => {
    store = createSpyObj('store', ['pipe', 'dispatch']);
  });

  it('should dispatch minimize action on minimize', () => {
    const resizeBehavior = new ResizeBehaviorImpl(store, 'abc');
    resizeBehavior.minimize();
    expect(store.dispatch).toHaveBeenCalledWith(new placeholdersActions.Minimize('abc'));
  });

  it('should dispatch maximize action on maximize', () => {
    const resizeBehavior = new ResizeBehaviorImpl(store, 'abc');
    resizeBehavior.maximize();
    expect(store.dispatch).toHaveBeenCalledWith(new placeholdersActions.Maximize('abc'));
  });
});
