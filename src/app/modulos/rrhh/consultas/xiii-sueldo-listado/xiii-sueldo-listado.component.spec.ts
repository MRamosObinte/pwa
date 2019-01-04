import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XiiiSueldoListadoComponent } from './xiii-sueldo-listado.component';

describe('XiiiSueldoListadoComponent', () => {
  let component: XiiiSueldoListadoComponent;
  let fixture: ComponentFixture<XiiiSueldoListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XiiiSueldoListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XiiiSueldoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
