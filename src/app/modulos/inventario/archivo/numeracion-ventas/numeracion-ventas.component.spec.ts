import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeracionVentasComponent } from './numeracion-ventas.component';

describe('NumeracionVentasComponent', () => {
  let component: NumeracionVentasComponent;
  let fixture: ComponentFixture<NumeracionVentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
