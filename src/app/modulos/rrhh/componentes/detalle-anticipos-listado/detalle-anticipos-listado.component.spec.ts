import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAnticiposListadoComponent } from './detalle-anticipos-listado.component';

describe('DetalleAnticiposListadoComponent', () => {
  let component: DetalleAnticiposListadoComponent;
  let fixture: ComponentFixture<DetalleAnticiposListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleAnticiposListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleAnticiposListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
