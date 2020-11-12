import {Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {ColorPalette} from '../../../common/models';
import * as fromPalette from '../../actions/palette.actions';
import * as fromUsers from '../../reducers';

@Component({
  selector: 'app-palette-form-container',
  templateUrl: './palette-form-container.component.html'
})
export class PaletteFormContainerComponent {
  private _store: Store<fromUsers.State>;

  errorMessage$: Observable<string>;

  constructor(store: Store<fromUsers.State>) {
    this._store = store;
    this.errorMessage$ = this.store.pipe(select(fromUsers.getPaletteErrorMessage));
  }

  get store(): Store<fromUsers.State> {
    return this._store;
  }

  handleSavePalette(palette: ColorPalette) {
    this.store.dispatch(new fromPalette.AddUserPalette(palette));
  }
}
