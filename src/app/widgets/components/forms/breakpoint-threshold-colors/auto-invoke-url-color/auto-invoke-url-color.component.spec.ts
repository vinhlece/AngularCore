import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoInvokeUrlColorComponent } from './auto-invoke-url-color.component';

describe('AutoInvokeUrlColorComponent', () => {
  let component: AutoInvokeUrlColorComponent;
  let fixture: ComponentFixture<AutoInvokeUrlColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoInvokeUrlColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoInvokeUrlColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
