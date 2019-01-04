import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnticipoProveedoresSaldoGeneralComponent } from './anticipo-proveedores-saldo-general.component';

describe('AnticipoProveedoresSaldoGeneralComponent', () => {
  let component: AnticipoProveedoresSaldoGeneralComponent;
  let fixture: ComponentFixture<AnticipoProveedoresSaldoGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnticipoProveedoresSaldoGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnticipoProveedoresSaldoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
