import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPlanCuentasComponent } from './listado-plan-cuentas.component';

describe('ListadoPlanCuentasComponent', () => {
  let component: ListadoPlanCuentasComponent;
  let fixture: ComponentFixture<ListadoPlanCuentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoPlanCuentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPlanCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
