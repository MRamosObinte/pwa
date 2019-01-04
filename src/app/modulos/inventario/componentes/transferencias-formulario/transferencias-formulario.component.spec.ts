import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciasFormularioComponent } from './transferencias-formulario.component';

describe('TransferenciasFormularioComponent', () => {
  let component: TransferenciasFormularioComponent;
  let fixture: ComponentFixture<TransferenciasFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferenciasFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciasFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
