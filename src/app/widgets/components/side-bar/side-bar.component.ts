import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { SideBarItem } from '../../models';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ThemeService} from '../../../theme/theme.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarComponent implements OnChanges, OnInit {
  @Input() matches: SideBarItem[] = [];
  @Input() currentLibrary: any;
  @Output() searchTextChangeEvent: EventEmitter<string> = new EventEmitter();
  @Output() onCloseSideBar = new EventEmitter();

  private _fb: FormBuilder;
  form: FormGroup;

  constructor(fb: FormBuilder, themeService: ThemeService) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({ searchText: [''] });
  }

  onSearchChange(event) {
    this.searchTextChangeEvent.emit(this.form.value.searchText);
  }

  handleCloseSideBar(event) {
    this.onCloseSideBar.emit(event);
  }

  ngOnChanges(changes: SimpleChanges) {
    const dataCurrentLibrary = changes['currentLibrary'];
    // Reset text input field in case change type of library
    if (dataCurrentLibrary && this.form && dataCurrentLibrary.currentValue !== dataCurrentLibrary.previousValue) {
      this.form.get('searchText').setValue('');
    }
  }
}
