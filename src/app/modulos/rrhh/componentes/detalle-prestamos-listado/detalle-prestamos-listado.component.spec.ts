import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePrestamosListadoComponent } from './detalle-prestamos-listado.component';

describe('DetallePrestamosListadoComponent', () => {
  let component: DetallePrestamosListadoComponent;
  let fixture: ComponentFixture<DetallePrestamosListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallePrestamosListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePrestamosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
