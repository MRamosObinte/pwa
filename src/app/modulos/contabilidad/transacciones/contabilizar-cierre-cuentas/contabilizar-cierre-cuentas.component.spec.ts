import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilizarCierreCuentasComponent } from './contabilizar-cierre-cuentas.component';

describe('ContabilizarCierreCuentasComponent', () => {
  let component: ContabilizarCierreCuentasComponent;
  let fixture: ComponentFixture<ContabilizarCierreCuentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContabilizarCierreCuentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabilizarCierreCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
