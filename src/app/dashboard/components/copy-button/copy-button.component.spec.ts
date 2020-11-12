import {ComponentFixture, TestBed} from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CopyButtonComponent} from './copy-button.component';
import {TranslateModule} from '@ngx-translate/core';

describe('CopyButtonComponent', () => {
  let comp: CopyButtonComponent;
  let fixture: ComponentFixture<CopyButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        TranslateModule.forRoot()
      ],
      declarations: [CopyButtonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyButtonComponent);
    comp = fixture.componentInstance;
  });

  it('should emit copy event when click copy button', () => {
    const el = fixture.debugElement.query(By.css('button'));
    const spy = spyOn(comp.onCopy, 'emit');
    el.triggerEventHandler('click', {});
    expect(spy).toHaveBeenCalled();
  });
});
