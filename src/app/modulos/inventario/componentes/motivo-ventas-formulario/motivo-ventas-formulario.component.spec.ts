import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoVentasFormularioComponent } from './motivo-ventas-formulario.component';

describe('MotivoVentasFormularioComponent', () => {
  let component: MotivoVentasFormularioComponent;
  let fixture: ComponentFixture<MotivoVentasFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoVentasFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoVentasFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
