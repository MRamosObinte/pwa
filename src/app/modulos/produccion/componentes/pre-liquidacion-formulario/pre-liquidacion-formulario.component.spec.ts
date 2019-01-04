import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreLiquidacionFormularioComponent } from './pre-liquidacion-formulario.component';

describe('PreLiquidacionFormularioComponent', () => {
  let component: PreLiquidacionFormularioComponent;
  let fixture: ComponentFixture<PreLiquidacionFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreLiquidacionFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreLiquidacionFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
