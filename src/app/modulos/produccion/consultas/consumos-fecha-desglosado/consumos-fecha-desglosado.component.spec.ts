import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumosFechaDesglosadoComponent } from './consumos-fecha-desglosado.component';

describe('ConsumosFechaDesglosadoComponent', () => {
  let component: ConsumosFechaDesglosadoComponent;
  let fixture: ComponentFixture<ConsumosFechaDesglosadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumosFechaDesglosadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumosFechaDesglosadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
