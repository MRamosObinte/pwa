import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionPescaComponent } from './liquidacion-pesca.component';

describe('LiquidacionPescaComponent', () => {
  let component: LiquidacionPescaComponent;
  let fixture: ComponentFixture<LiquidacionPescaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidacionPescaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionPescaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
