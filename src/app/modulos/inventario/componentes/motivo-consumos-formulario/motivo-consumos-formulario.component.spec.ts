import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoConsumosFormularioComponent } from './motivo-consumos-formulario.component';

describe('MotivoConsumosFormularioComponent', () => {
  let component: MotivoConsumosFormularioComponent;
  let fixture: ComponentFixture<MotivoConsumosFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoConsumosFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoConsumosFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
