import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaPagoComponent } from './forma-pago.component';

describe('FormaPagoComponent', () => {
  let component: FormaPagoComponent;
  let fixture: ComponentFixture<FormaPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormaPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
