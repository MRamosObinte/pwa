import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDatosCrediticiosComponent } from './registro-datos-crediticios.component';

describe('RegistroDatosCrediticiosComponent', () => {
  let component: RegistroDatosCrediticiosComponent;
  let fixture: ComponentFixture<RegistroDatosCrediticiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroDatosCrediticiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroDatosCrediticiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
