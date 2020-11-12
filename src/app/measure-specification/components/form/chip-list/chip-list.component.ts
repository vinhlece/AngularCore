import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss']
})
export class ChipListComponent implements OnInit {

  @Input() data;
  constructor() { }

  ngOnInit() {
  }

}
