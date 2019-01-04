import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskCalendarComponent } from './mask-calendar.component';

describe('MaskCalendarComponent', () => {
  let component: MaskCalendarComponent;
  let fixture: ComponentFixture<MaskCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaskCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaskCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
