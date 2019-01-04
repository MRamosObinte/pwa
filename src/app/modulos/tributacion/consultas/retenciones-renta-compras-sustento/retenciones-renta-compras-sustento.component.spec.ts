import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesRentaComprasSustentoComponent } from './retenciones-renta-compras-sustento.component';

describe('RetencionesRentaComprasSustentoComponent', () => {
  let component: RetencionesRentaComprasSustentoComponent;
  let fixture: ComponentFixture<RetencionesRentaComprasSustentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetencionesRentaComprasSustentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesRentaComprasSustentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
