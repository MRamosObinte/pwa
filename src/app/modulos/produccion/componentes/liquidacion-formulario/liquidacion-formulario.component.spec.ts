import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionFormularioComponent } from './liquidacion-formulario.component';

describe('LiquidacionFormularioComponent', () => {
  let component: LiquidacionFormularioComponent;
  let fixture: ComponentFixture<LiquidacionFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidacionFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
