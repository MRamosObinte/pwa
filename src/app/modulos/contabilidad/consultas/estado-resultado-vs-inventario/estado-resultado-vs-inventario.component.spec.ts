import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoResultadoVsInventarioComponent } from './estado-resultado-vs-inventario.component';

describe('EstadoResultadoVsInventarioComponent', () => {
  let component: EstadoResultadoVsInventarioComponent;
  let fixture: ComponentFixture<EstadoResultadoVsInventarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoResultadoVsInventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoResultadoVsInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
