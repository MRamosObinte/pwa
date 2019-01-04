import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioConciliacionBancariaComponent } from './formulario-conciliacion-bancaria.component';

describe('FormularioConciliacionBancariaComponent', () => {
  let component: FormularioConciliacionBancariaComponent;
  let fixture: ComponentFixture<FormularioConciliacionBancariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioConciliacionBancariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioConciliacionBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
