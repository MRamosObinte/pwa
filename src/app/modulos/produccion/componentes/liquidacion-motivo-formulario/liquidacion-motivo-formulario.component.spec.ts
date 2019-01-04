import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionMotivoFormularioComponent } from './liquidacion-motivo-formulario.component';

describe('LiquidacionMotivoFormularioComponent', () => {
  let component: LiquidacionMotivoFormularioComponent;
  let fixture: ComponentFixture<LiquidacionMotivoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidacionMotivoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionMotivoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
