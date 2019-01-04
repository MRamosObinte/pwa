import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodoXivSueldoComponent } from './periodo-xiv-sueldo.component';

describe('PeriodoXivSueldoComponent', () => {
  let component: PeriodoXivSueldoComponent;
  let fixture: ComponentFixture<PeriodoXivSueldoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodoXivSueldoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodoXivSueldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
