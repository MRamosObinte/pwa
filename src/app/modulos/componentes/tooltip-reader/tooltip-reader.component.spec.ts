import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipReaderComponent } from './tooltip-reader.component';

describe('TooltipReaderComponent', () => {
  let component: TooltipReaderComponent;
  let fixture: ComponentFixture<TooltipReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TooltipReaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
