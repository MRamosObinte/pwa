import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteElectronicoComprasComponent } from './comprobante-electronico-compras.component';

describe('ComprobanteElectronicoComprasComponent', () => {
  let component: ComprobanteElectronicoComprasComponent;
  let fixture: ComponentFixture<ComprobanteElectronicoComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobanteElectronicoComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteElectronicoComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
