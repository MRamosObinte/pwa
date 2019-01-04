import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarComprobanteContableComponent } from './consultar-comprobante-contable.component';

describe('ConsultarComprobanteContableComponent', () => {
  let component: ConsultarComprobanteContableComponent;
  let fixture: ComponentFixture<ConsultarComprobanteContableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarComprobanteContableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarComprobanteContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
