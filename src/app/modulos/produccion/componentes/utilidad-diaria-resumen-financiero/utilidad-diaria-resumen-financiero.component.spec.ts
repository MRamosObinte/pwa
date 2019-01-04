import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilidadDiariaResumenFinancieroComponent } from './utilidad-diaria-resumen-financiero.component';

describe('UtilidadDiariaResumenFinancieroComponent', () => {
  let component: UtilidadDiariaResumenFinancieroComponent;
  let fixture: ComponentFixture<UtilidadDiariaResumenFinancieroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilidadDiariaResumenFinancieroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilidadDiariaResumenFinancieroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
