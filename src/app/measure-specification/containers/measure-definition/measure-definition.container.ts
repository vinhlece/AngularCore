import { Component, OnInit } from '@angular/core';
import {commonRouterList} from '../../../common/models/constants';

@Component({
  selector: 'app-measure-definition-container',
  templateUrl: './measure-definition.container.html',
  styleUrls: ['./measure-definition.container.scss']
})
export class MeasureDefinitionContainer implements OnInit {

  routerList = commonRouterList('/measures');

  constructor() { }

  ngOnInit() {
  }

}
