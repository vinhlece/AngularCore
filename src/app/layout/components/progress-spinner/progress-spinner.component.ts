import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss'],
})

export class ProgressSpinnerComponent implements OnInit {
  @Input() data$: Observable<any>;

  isProgress: boolean = true;
  ngOnInit(): void {
    this.data$.subscribe((data) => {
      if (data.length > 0) {
        this.isProgress = false;
      } else {
        setTimeout(() => {
          this.isProgress = false;
        }, 2000);
      }
    });
  }
}
