import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {ColorPalette} from '../../../common/models';
import * as fromPalette from '../../actions/palette.actions';
import * as fromUsers from '../../reducers';
import {UserPaletteService} from '../../services/settings/user-palette.service';
import {PaletteFormContainerComponent} from '../palette-form-container/palette-form-container.component';

@Component({
  selector: 'app-edit-palette-form-container',
  templateUrl: './edit-palette-form-container.component.html'
})
export class EditPaletteFormContainerComponent extends PaletteFormContainerComponent implements OnInit {
  currentPalette$: Observable<ColorPalette>;

  constructor(store: Store<fromUsers.State>, private route: ActivatedRoute, private paletteService: UserPaletteService) {
    super(store);
  }

  ngOnInit() {
    this.route.params.subscribe(param => {
      const paletteId = param.id;
      if (paletteId) {
        this.currentPalette$ = this.paletteService.getPaletteById(paletteId);
      }
    });
  }

  handleSavePalette(palette: ColorPalette) {
    this.store.dispatch(new fromPalette.UpdateUserPalette(palette));
  }
}
