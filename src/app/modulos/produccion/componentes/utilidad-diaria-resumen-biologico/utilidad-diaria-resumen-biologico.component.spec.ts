import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilidadDiariaResumenBiologicoComponent } from './utilidad-diaria-resumen-biologico.component';

describe('UtilidadDiariaResumenBiologicoComponent', () => {
  let component: UtilidadDiariaResumenBiologicoComponent;
  let fixture: ComponentFixture<UtilidadDiariaResumenBiologicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilidadDiariaResumenBiologicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilidadDiariaResumenBiologicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
