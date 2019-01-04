import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaFormularioComponent } from './venta-formulario.component';

describe('VentaFormularioComponent', () => {
  let component: VentaFormularioComponent;
  let fixture: ComponentFixture<VentaFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
