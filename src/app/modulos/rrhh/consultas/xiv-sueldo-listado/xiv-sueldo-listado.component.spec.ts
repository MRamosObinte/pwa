import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XivSueldoListadoComponent } from './xiv-sueldo-listado.component';

describe('XivSueldoListadoComponent', () => {
  let component: XivSueldoListadoComponent;
  let fixture: ComponentFixture<XivSueldoListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XivSueldoListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XivSueldoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
