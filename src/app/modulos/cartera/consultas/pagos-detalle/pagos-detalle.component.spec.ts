import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosDetalleComponent } from './pagos-detalle.component';

describe('PagosDetalleComponent', () => {
  let component: PagosDetalleComponent;
  let fixture: ComponentFixture<PagosDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagosDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
