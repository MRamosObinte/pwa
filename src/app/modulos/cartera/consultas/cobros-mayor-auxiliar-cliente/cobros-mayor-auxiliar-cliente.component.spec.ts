import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobrosMayorAuxiliarClienteComponent } from './cobros-mayor-auxiliar-cliente.component';

describe('CobrosMayorAuxiliarClienteComponent', () => {
  let component: CobrosMayorAuxiliarClienteComponent;
  let fixture: ComponentFixture<CobrosMayorAuxiliarClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobrosMayorAuxiliarClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobrosMayorAuxiliarClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
