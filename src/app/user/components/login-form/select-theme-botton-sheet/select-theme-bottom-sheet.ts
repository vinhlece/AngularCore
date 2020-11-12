import {Component} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-select-theme-bottom-sheet',
  templateUrl: './select-theme-bottom-sheet.html'
})
export class SelectThemeBottomSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<SelectThemeBottomSheet>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
