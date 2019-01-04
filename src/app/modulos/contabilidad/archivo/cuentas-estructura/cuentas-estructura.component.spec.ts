import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasEstructuraComponent } from './cuentas-estructura.component';

describe('CuentasEstructuraComponent', () => {
  let component: CuentasEstructuraComponent;
  let fixture: ComponentFixture<CuentasEstructuraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentasEstructuraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasEstructuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
