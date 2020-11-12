import {Component, Inject, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as values from 'lodash/values';
import {DataTypes} from '../../../measures/models/enums';
import * as navigationActions from '../../../layout/actions/navigation.actions';
import * as widgetsActions from '../../actions/widgets.actions';
import {WidgetType} from '../../constants/widget-types';
import {Widget} from '../../models';
import * as fromWidgets from '../../reducers';
import {WidgetsFactory} from '../../services';
import {WIDGETS_FACTORY} from '../../services/tokens';
import * as fromUser from '../../../user/reducers';
import {ColorPalette} from '../../../common/models/index';

@Component({
  selector: 'app-add-widget',
  templateUrl: './add-widget.container.html',
  styleUrls: ['./add-widget.container.scss']
})
export class AddWidgetContainer implements OnInit {
  private _store: Store<fromWidgets.State>;
  private _factory: WidgetsFactory;
  private _colorPalette: ColorPalette;

  widgetTypes: string[];
  dataTypes: string[];

  constructor(store: Store<fromWidgets.State>, @Inject(WIDGETS_FACTORY) factory: WidgetsFactory) {
    this._store = store;
    this._factory = factory;

    this.widgetTypes = values(WidgetType);
    this.dataTypes = values(DataTypes);
  }

  ngOnInit() {
    this._store.pipe(select(fromUser.getCurrentColorPalette))
      .subscribe(palette => this._colorPalette = palette);
  }

  handleSubmit(widget: Widget) {
    this._store.dispatch(new widgetsActions.AddAndNavigate(this._factory.create(widget, this._colorPalette)));
  }

  handleCancel() {
    this._store.dispatch(navigationActions.navigateToWidgetList());
  }
}
