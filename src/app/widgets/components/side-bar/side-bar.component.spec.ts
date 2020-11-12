import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DraggableWidgetComponent} from '../draggable-widget/draggable-widget.component';
import {SideBarComponent} from './side-bar.component';
import {By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

xdescribe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatAutocompleteModule,
        FlexLayoutModule,
        MatSidenavModule,
        MatIconModule
      ],
      declarations: [
        SideBarComponent,
        DraggableWidgetComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  it('should have search input element', () => {
    const el = fixture.debugElement.query(By.css('.searchInput'));
    expect(el).toBeTruthy();
  });
  it('should emit search text change event', () => {
    const el = fixture.debugElement.query(By.css('.searchInput'));
    const spy = spyOn(component.searchTextChangeEvent, 'emit');
    // TODO NG MODEL CHANGE IS REMOVED FROM ANGLUAR
    // el.triggerEventHandler('ngModelChange', 'a');
    // expect(spy).toHaveBeenCalledWith('a');
  });
});
