import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisVentasVsCostosComponent } from './analisis-ventas-vs-costos.component';

describe('AnalisisVentasVsCostosComponent', () => {
  let component: AnalisisVentasVsCostosComponent;
  let fixture: ComponentFixture<AnalisisVentasVsCostosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisisVentasVsCostosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisisVentasVsCostosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
