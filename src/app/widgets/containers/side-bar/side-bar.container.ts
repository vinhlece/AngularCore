import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/internal/Observable';
import * as searchActions from '../../actions/search.actions';
import * as fromWidgets from '../../reducers';
import {map} from 'rxjs/operators';
import {SideBarItem} from '../../models';
import {delay} from 'rxjs/internal/operators';

@Component({
  selector: 'app-side-bar-container',
  templateUrl: './side-bar.container.html',
})
export class SideBarContainer implements OnInit, OnChanges {
  @Input() currentLibrary: any;
  @Output() onCloseSideBar = new EventEmitter();

  private _store: Store<fromWidgets.State>;

  items$: Observable<SideBarItem[]>;

  constructor(store: Store<fromWidgets.State>) {
    this._store = store;
  }

  ngOnInit() {
    this.items$ = this._store.pipe(
      select(fromWidgets.getSearchResults),
      map((results: any) => (
        Object.keys(results).reduce((acc: SideBarItem[], itemType: string) => {
          const items = results[itemType].map((item) => ({type: itemType, payload: item}));
          acc.push(...items);
          return acc;
        }, [])
      )),
      delay(0)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    const dataCurrentLibrary = changes['currentLibrary'];
    // Update data for search bar when changing the type of library
    if (dataCurrentLibrary && dataCurrentLibrary.currentValue !== dataCurrentLibrary.previousValue) {
      this._store.dispatch(new searchActions.Search(`${dataCurrentLibrary.currentValue.params.searchType}:`));
    }
  }

  handleSearch(token: string) {
    this._store.dispatch(new searchActions.Search(`${this.currentLibrary.params.searchType}:${token}`));
  }

  handleCloseSideBar(event) {
    this.onCloseSideBar.emit(event);
  }
}
