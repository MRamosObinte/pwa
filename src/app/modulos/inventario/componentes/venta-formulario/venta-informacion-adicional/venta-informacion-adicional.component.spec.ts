import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaInformacionAdicionalComponent } from './venta-informacion-adicional.component';

describe('VentaInformacionAdicionalComponent', () => {
  let component: VentaInformacionAdicionalComponent;
  let fixture: ComponentFixture<VentaInformacionAdicionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaInformacionAdicionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaInformacionAdicionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
