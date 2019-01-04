import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoTransferenciasFormularioComponent } from './motivo-transferencias-formulario.component';

describe('MotivoTransferenciasFormularioComponent', () => {
  let component: MotivoTransferenciasFormularioComponent;
  let fixture: ComponentFixture<MotivoTransferenciasFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoTransferenciasFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoTransferenciasFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
