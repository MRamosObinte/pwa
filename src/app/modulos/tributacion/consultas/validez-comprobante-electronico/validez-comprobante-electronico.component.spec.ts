import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidezComprobanteElectronicoComponent } from './validez-comprobante-electronico.component';

describe('ValidezComprobanteElectronicoComponent', () => {
  let component: ValidezComprobanteElectronicoComponent;
  let fixture: ComponentFixture<ValidezComprobanteElectronicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidezComprobanteElectronicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidezComprobanteElectronicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
