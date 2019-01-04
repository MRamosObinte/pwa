import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumosProductosProcesoComponent } from './consumos-productos-proceso.component';

describe('ConsumosProductosProcesoComponent', () => {
  let component: ConsumosProductosProcesoComponent;
  let fixture: ComponentFixture<ConsumosProductosProcesoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumosProductosProcesoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumosProductosProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
