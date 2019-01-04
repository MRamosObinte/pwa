import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodoUtilidadComponent } from './periodo-utilidad.component';

describe('PeriodoUtilidadComponent', () => {
  let component: PeriodoUtilidadComponent;
  let fixture: ComponentFixture<PeriodoUtilidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodoUtilidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodoUtilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
