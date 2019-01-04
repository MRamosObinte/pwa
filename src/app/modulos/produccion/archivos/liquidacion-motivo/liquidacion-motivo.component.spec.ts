import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionMotivoComponent } from './liquidacion-motivo.component';

describe('LiquidacionMotivoComponent', () => {
  let component: LiquidacionMotivoComponent;
  let fixture: ComponentFixture<LiquidacionMotivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidacionMotivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionMotivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
