import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreLiquidacionMotivoFormularioComponent } from './pre-liquidacion-motivo-formulario.component';

describe('PreLiquidacionMotivoFormularioComponent', () => {
  let component: PreLiquidacionMotivoFormularioComponent;
  let fixture: ComponentFixture<PreLiquidacionMotivoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreLiquidacionMotivoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreLiquidacionMotivoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
