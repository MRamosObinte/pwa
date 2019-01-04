import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosProductosProcesosComponent } from './costos-productos-procesos.component';

describe('CostosProductosProcesosComponent', () => {
  let component: CostosProductosProcesosComponent;
  let fixture: ComponentFixture<CostosProductosProcesosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostosProductosProcesosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostosProductosProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
