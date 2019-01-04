import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisPesosCrecimientoComponent } from './analisis-pesos-crecimiento.component';

describe('AnalisisPesosCrecimientoComponent', () => {
  let component: AnalisisPesosCrecimientoComponent;
  let fixture: ComponentFixture<AnalisisPesosCrecimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisisPesosCrecimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisisPesosCrecimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
