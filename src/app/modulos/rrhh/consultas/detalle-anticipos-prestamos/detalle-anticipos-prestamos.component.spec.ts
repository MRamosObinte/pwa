import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAnticiposPrestamosComponent } from './detalle-anticipos-prestamos.component';

describe('DetalleAnticiposPrestamosComponent', () => {
  let component: DetalleAnticiposPrestamosComponent;
  let fixture: ComponentFixture<DetalleAnticiposPrestamosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleAnticiposPrestamosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleAnticiposPrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
