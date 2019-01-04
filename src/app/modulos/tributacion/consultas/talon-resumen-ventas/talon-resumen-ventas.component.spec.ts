import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalonResumenVentasComponent } from './talon-resumen-ventas.component';

describe('TalonResumenVentasComponent', () => {
  let component: TalonResumenVentasComponent;
  let fixture: ComponentFixture<TalonResumenVentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalonResumenVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalonResumenVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
