import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreLiquidacionMotivoComponent } from './pre-liquidacion-motivo.component';

describe('PreLiquidacionMotivoComponent', () => {
  let component: PreLiquidacionMotivoComponent;
  let fixture: ComponentFixture<PreLiquidacionMotivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreLiquidacionMotivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreLiquidacionMotivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
