import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarFechaVencimientoChequeComponent } from './cambiar-fecha-vencimiento-cheque.component';

describe('CambiarFechaVencimientoChequeComponent', () => {
  let component: CambiarFechaVencimientoChequeComponent;
  let fixture: ComponentFixture<CambiarFechaVencimientoChequeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambiarFechaVencimientoChequeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarFechaVencimientoChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
