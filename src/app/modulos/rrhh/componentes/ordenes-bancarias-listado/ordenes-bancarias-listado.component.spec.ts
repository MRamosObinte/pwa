import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesBancariasListadoComponent } from './ordenes-bancarias-listado.component';

describe('OrdenesBancariasListadoComponent', () => {
  let component: OrdenesBancariasListadoComponent;
  let fixture: ComponentFixture<OrdenesBancariasListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenesBancariasListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesBancariasListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
