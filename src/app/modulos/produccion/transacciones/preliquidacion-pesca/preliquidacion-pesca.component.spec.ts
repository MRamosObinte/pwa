import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreliquidacionPescaComponent } from './preliquidacion-pesca.component';

describe('PreliquidacionPescaComponent', () => {
  let component: PreliquidacionPescaComponent;
  let fixture: ComponentFixture<PreliquidacionPescaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreliquidacionPescaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreliquidacionPescaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
