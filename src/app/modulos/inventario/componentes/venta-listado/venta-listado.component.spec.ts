import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaListadoComponent } from './venta-listado.component';

describe('VentaListadoComponent', () => {
  let component: VentaListadoComponent;
  let fixture: ComponentFixture<VentaListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
