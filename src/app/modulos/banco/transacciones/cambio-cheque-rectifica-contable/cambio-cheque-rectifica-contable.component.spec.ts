import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioChequeRectificaContableComponent } from './cambio-cheque-rectifica-contable.component';

describe('CambioChequeRectificaContableComponent', () => {
  let component: CambioChequeRectificaContableComponent;
  let fixture: ComponentFixture<CambioChequeRectificaContableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioChequeRectificaContableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioChequeRectificaContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
