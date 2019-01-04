import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolPagoComponent } from './rol-pago.component';

describe('RolPagoComponent', () => {
  let component: RolPagoComponent;
  let fixture: ComponentFixture<RolPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
