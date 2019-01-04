import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaBusquedaComponent } from './venta-busqueda.component';

describe('VentaBusquedaComponent', () => {
  let component: VentaBusquedaComponent;
  let fixture: ComponentFixture<VentaBusquedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaBusquedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
