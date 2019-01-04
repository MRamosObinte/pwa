import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioChequeGeneraContableComponent } from './cambio-cheque-genera-contable.component';

describe('CambioChequeGeneraContableComponent', () => {
  let component: CambioChequeGeneraContableComponent;
  let fixture: ComponentFixture<CambioChequeGeneraContableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioChequeGeneraContableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioChequeGeneraContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
