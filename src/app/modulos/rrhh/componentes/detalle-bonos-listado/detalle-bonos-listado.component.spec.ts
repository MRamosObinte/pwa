import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleBonosListadoComponent } from './detalle-bonos-listado.component';

describe('DetalleBonosListadoComponent', () => {
  let component: DetalleBonosListadoComponent;
  let fixture: ComponentFixture<DetalleBonosListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleBonosListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleBonosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
