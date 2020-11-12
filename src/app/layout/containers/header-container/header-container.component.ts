import {Component, OnDestroy, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {getRouter} from '../../../reducers';
import * as fromUser from '../../../user/actions/user.actions';
import * as fromUsers from '../../../user/reducers';
import * as colorPaletteActions from '../../../user/actions/palette.actions';
import {ColorPalette} from '../../../common/models/index';
import {User} from '../../../user/models/user';

@Component({
  selector: 'app-header-container',
  templateUrl: './header-container.component.html',
  styleUrls: ['./header-container.component.scss']
})
export class HeaderContainerComponent implements OnInit, OnDestroy {
  @Input() routerList = [];
  @Output() onTriggerAction = new EventEmitter();

  private _store: Store<fromUsers.State>;
  private _unsubscribe = new Subject<void>();

  // palattes$: Observable<ColorPalette[]>;

  loginInformation$: Observable<User>;
  currentLocation: string;

  constructor(store: Store<fromUsers.State>) {
    this.loginInformation$ = store.pipe(select(fromUsers.getAuthenticatedUser));
    this._store = store;
  }

  ngOnInit() {
    this._store
      .pipe(
        select(getRouter),
        takeUntil(this._unsubscribe)
      )
      .subscribe(route => {
        if (route) {
          this.currentLocation = this.getLocation(route.state.url);
        }
      });

    // this.palattes$ =  this._store.pipe(select(fromEntities.getNormalizedPalettes));
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.unsubscribe();
  }

  logoutUser() {
    this._store.dispatch(new fromUser.Logout());
  }

  getLocation(url) {
    const firstSlash = url.indexOf('/');
    const secondSlash = url.indexOf('/', firstSlash + 1);
    const questionIndex = url.indexOf('?');
    if (firstSlash >= 0) {
      if (secondSlash > 0) {
        return url.substring(firstSlash + 1, secondSlash);
      } else if (questionIndex > 0) {
        return url.substring(firstSlash + 1, questionIndex);

      } else {
        return url.substring(firstSlash + 1);
      }
    }
  }

  handleChangeColorPalette(palette: ColorPalette) {
    this._store.dispatch(new colorPaletteActions.ChangeColorPalette(palette));
  }
  handleDeleteColorPalette(paletteId: string) {
    this._store.dispatch(new colorPaletteActions.DeletePalette(paletteId));
  }

  handleTriggerAction(event) {
    this.onTriggerAction.emit(event);
  }
}
