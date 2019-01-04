import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoFormaDetalleComponent } from './pago-forma-detalle.component';

describe('PagoFormaDetalleComponent', () => {
  let component: PagoFormaDetalleComponent;
  let fixture: ComponentFixture<PagoFormaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoFormaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoFormaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
