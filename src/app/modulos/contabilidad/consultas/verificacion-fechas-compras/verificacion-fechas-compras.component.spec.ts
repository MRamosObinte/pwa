import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionFechasComprasComponent } from './verificacion-fechas-compras.component';

describe('VerificacionFechasComprasComponent', () => {
  let component: VerificacionFechasComprasComponent;
  let fixture: ComponentFixture<VerificacionFechasComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificacionFechasComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificacionFechasComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
