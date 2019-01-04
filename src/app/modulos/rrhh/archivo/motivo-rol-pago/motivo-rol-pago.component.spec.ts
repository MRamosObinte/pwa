import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoRolPagoComponent } from './motivo-rol-pago.component';

describe('MotivoRolPagoComponent', () => {
  let component: MotivoRolPagoComponent;
  let fixture: ComponentFixture<MotivoRolPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoRolPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoRolPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
